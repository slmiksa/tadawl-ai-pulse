import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Globe, ExternalLink, X } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  url: string;
  category: string;
  symbol?: string | null;
}

interface NewsModalProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsModal({ article, isOpen, onClose }: NewsModalProps) {
  if (!article) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `منذ ${diffInDays} يوم`;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'general':
        return 'bg-primary/20 text-primary';
      case 'forex':
        return 'bg-green-500/20 text-green-400';
      case 'crypto':
        return 'bg-orange-500/20 text-orange-400';
      case 'merger':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category.toLowerCase()) {
      case 'general':
        return 'عام';
      case 'forex':
        return 'فوركس';
      case 'crypto':
        return 'العملات المشفرة';
      case 'merger':
        return 'اندماجات';
      default:
        return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground leading-tight pr-8">
              {article.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="font-medium">{article.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <Badge className={getCategoryBadgeColor(article.category)}>
              {getCategoryName(article.category)}
            </Badge>
            {article.symbol && (
              <Badge variant="outline">
                {article.symbol}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Article Content */}
          <div className="space-y-4">
            <div className="text-lg text-muted-foreground leading-relaxed">
              {article.summary}
            </div>
            
            <hr className="border-border" />
            
            <div className="text-foreground leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="text-sm text-muted-foreground">
              مصدر الخبر: {article.source}
            </div>
            <Button 
              variant="outline" 
              asChild
              className="gap-2"
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                المقال الأصلي
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}