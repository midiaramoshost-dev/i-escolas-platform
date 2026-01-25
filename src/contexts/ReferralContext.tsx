import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Referral {
  id: string;
  referrerEmail: string;
  referredEmail: string;
  referredName: string;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export interface ReferralReward {
  id: string;
  userEmail: string;
  type: 'free_month';
  earned: boolean;
  earnedAt?: string;
  usedAt?: string;
}

interface ReferralContextType {
  referralCode: string | null;
  referrals: Referral[];
  rewards: ReferralReward[];
  pendingCount: number;
  completedCount: number;
  availableRewards: number;
  generateReferralCode: () => string;
  applyReferralCode: (code: string) => Promise<boolean>;
  getReferralLink: () => string;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

const STORAGE_KEYS = {
  REFERRAL_CODES: 'iescolas_referral_codes',
  REFERRALS: 'iescolas_referrals',
  REWARDS: 'iescolas_rewards',
};

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'IESC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getReferralCodes(): Record<string, string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REFERRAL_CODES);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveReferralCodes(codes: Record<string, string>) {
  localStorage.setItem(STORAGE_KEYS.REFERRAL_CODES, JSON.stringify(codes));
}

function getReferrals(): Referral[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReferrals(referrals: Referral[]) {
  localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
}

function getRewards(): ReferralReward[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REWARDS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRewards(rewards: ReferralReward[]) {
  localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
}

export function ReferralProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);

  useEffect(() => {
    if (user) {
      const codes = getReferralCodes();
      if (codes[user.email]) {
        setReferralCode(codes[user.email]);
      } else {
        const newCode = generateCode();
        codes[user.email] = newCode;
        saveReferralCodes(codes);
        setReferralCode(newCode);
      }

      const allReferrals = getReferrals();
      setReferrals(allReferrals.filter(r => r.referrerEmail === user.email));

      const allRewards = getRewards();
      setRewards(allRewards.filter(r => r.userEmail === user.email));
      
      // Check for pending referral code from registration
      const pendingCode = localStorage.getItem('pending_referral_code');
      if (pendingCode) {
        localStorage.removeItem('pending_referral_code');
        // Apply the referral code
        const referrerEmail = Object.keys(codes).find(email => codes[email] === pendingCode);
        if (referrerEmail && referrerEmail !== user.email) {
          const existingReferral = allReferrals.some(r => r.referredEmail === user.email);
          if (!existingReferral) {
            const newReferral: Referral = {
              id: 'ref_' + Math.random().toString(36).substring(2, 11),
              referrerEmail,
              referredEmail: user.email,
              referredName: user.name,
              status: 'completed',
              createdAt: new Date().toISOString(),
              completedAt: new Date().toISOString(),
            };
            allReferrals.push(newReferral);
            saveReferrals(allReferrals);

            const allRewardsUpdated = getRewards();
            const newReward: ReferralReward = {
              id: 'rwd_' + Math.random().toString(36).substring(2, 11),
              userEmail: referrerEmail,
              type: 'free_month',
              earned: true,
              earnedAt: new Date().toISOString(),
            };
            allRewardsUpdated.push(newReward);
            saveRewards(allRewardsUpdated);
            
            // Notify the referrer about the earned reward
            toast({
              title: "🎉 Parabéns! Você ganhou uma recompensa!",
              description: "Uma indicação foi convertida e você ganhou 1 mês grátis!",
            });
          }
        }
      }
    } else {
      setReferralCode(null);
      setReferrals([]);
      setRewards([]);
    }
  }, [user]);

  const generateReferralCode = (): string => {
    if (!user) return '';
    const codes = getReferralCodes();
    if (!codes[user.email]) {
      const newCode = generateCode();
      codes[user.email] = newCode;
      saveReferralCodes(codes);
      setReferralCode(newCode);
      return newCode;
    }
    return codes[user.email];
  };

  const applyReferralCode = async (code: string): Promise<boolean> => {
    if (!user) return false;

    const codes = getReferralCodes();
    const referrerEmail = Object.keys(codes).find(email => codes[email] === code);

    if (!referrerEmail || referrerEmail === user.email) {
      return false;
    }

    const allReferrals = getReferrals();
    const alreadyReferred = allReferrals.some(r => r.referredEmail === user.email);
    if (alreadyReferred) {
      return false;
    }

    const newReferral: Referral = {
      id: 'ref_' + Math.random().toString(36).substring(2, 11),
      referrerEmail,
      referredEmail: user.email,
      referredName: user.name,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    allReferrals.push(newReferral);
    saveReferrals(allReferrals);

    const allRewards = getRewards();
    const newReward: ReferralReward = {
      id: 'rwd_' + Math.random().toString(36).substring(2, 11),
      userEmail: referrerEmail,
      type: 'free_month',
      earned: true,
      earnedAt: new Date().toISOString(),
    };
    allRewards.push(newReward);
    saveRewards(allRewards);

    if (user.email === referrerEmail) {
      setReferrals([...referrals, newReferral]);
      setRewards([...rewards, newReward]);
    }

    return true;
  };

  const getReferralLink = (): string => {
    if (!referralCode) return '';
    return `${window.location.origin}/cadastro?ref=${referralCode}`;
  };

  const pendingCount = referrals.filter(r => r.status === 'pending').length;
  const completedCount = referrals.filter(r => r.status === 'completed').length;
  const availableRewards = rewards.filter(r => r.earned && !r.usedAt).length;

  return (
    <ReferralContext.Provider
      value={{
        referralCode,
        referrals,
        rewards,
        pendingCount,
        completedCount,
        availableRewards,
        generateReferralCode,
        applyReferralCode,
        getReferralLink,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferral() {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
}
