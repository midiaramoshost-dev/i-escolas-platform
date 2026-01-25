import { useState } from 'react';
import { Gift, Copy, Check, Users, Award, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useReferral } from '@/contexts/ReferralContext';
import { useToast } from '@/hooks/use-toast';

export function ReferralCard() {
  const { referralCode, referrals, completedCount, availableRewards, getReferralLink } = useReferral();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (referralCode) {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Compartilhe com seus amigos.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    const link = getReferralLink();
    if (link) {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copiado!",
        description: "Envie para seus amigos se cadastrarem.",
      });
    }
  };

  const handleShare = async () => {
    const link = getReferralLink();
    if (navigator.share && link) {
      try {
        await navigator.share({
          title: 'i ESCOLAS - Indique e Ganhe',
          text: `Use meu código ${referralCode} e ganhe benefícios no i ESCOLAS!`,
          url: link,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Indique e Ganhe</CardTitle>
            <CardDescription>Ganhe 1 mês grátis por indicação</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Referral Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Seu código de indicação</label>
          <div className="flex gap-2">
            <Input 
              value={referralCode || ''} 
              readOnly 
              className="font-mono text-center text-lg font-bold tracking-wider"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleCopyCode}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Users className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold">{referrals.length}</p>
            <p className="text-xs text-muted-foreground">Indicados</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Check className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Convertidos</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/10">
            <Award className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{availableRewards}</p>
            <p className="text-xs text-muted-foreground">Meses ganhos</p>
          </div>
        </div>

        {/* Share Button */}
        <Button className="w-full" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar link de indicação
        </Button>

        {/* Recent Referrals */}
        {referrals.length > 0 && (
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Indicações recentes</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {referrals.slice(0, 5).map((referral) => (
                <div 
                  key={referral.id} 
                  className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30"
                >
                  <span className="truncate">{referral.referredName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    referral.status === 'completed' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {referral.status === 'completed' ? 'Convertido' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
