import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrendingUp, X } from 'lucide-react';
interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const WelcomeModal = ({
  isOpen,
  onClose
}: WelcomeModalProps) => {
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border border-purple-500/30 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-yellow-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
                  مرحباً بك في TadawlAI
                </DialogTitle>
                <p className="text-purple-300">منصة التداول الذكي</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Founder Story Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-yellow-600/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                م
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
              </h3>
                <p className="text-purple-300">مؤسسة المنصة</p>
              </div>
            </div>
            
            <div className="space-y-3 text-gray-300">
              <p className="italic text-purple-200">
                "أنا أختكم منى العنزي - شابة سعودية طموحة ولدي حلم"
              </p>
              <p className="leading-relaxed">
                كانت فكرة المنصة حلم يراود منى لسنوات، حلم أن يكون للجميع أداة ذكية تساعدهم على النجاح في التداول. 
                اليوم أصبح الحلم حقيقة، ونتمنى أن تكون هذه المنصة سببًا في نجاح كل من يستخدمها.
              </p>
              
              {/* Documentation Section */}
              <div className="mt-4 pt-4 border-t border-purple-500/30">
                
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose} className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-2">
              إغلاق
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default WelcomeModal;