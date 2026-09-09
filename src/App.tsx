import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenType, Language, NominalSelectionType, PaymentChannel, BankId } from './types';
import { mockDebtor, mockBreakdown } from './data/mockData';
import { generateVaNumber, generateRefNo } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { Stepper } from './components/Stepper';
import { LandingScreen } from './components/Screens/LandingScreen';
import { NominalScreen } from './components/Screens/NominalScreen';
import { MethodScreen } from './components/Screens/MethodScreen';
import { VirtualAccountScreen } from './components/Screens/VirtualAccountScreen';
import { WaitingScreen } from './components/Screens/WaitingScreen';
import { SuccessScreen } from './components/Screens/SuccessScreen';
import { Footer } from './components/Footer';
import { BillDetailModal } from './components/Modals/BillDetailModal';
import { PaymentGuideModal } from './components/Modals/PaymentGuideModal';

export default function App() {
  // Current active stage
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [language, setLanguage] = useState<Language>('ID');

  // Transaction state
  const [selectedNominalType, setSelectedNominalType] = useState<NominalSelectionType>('minimum');
  const [selectedAmount, setSelectedAmount] = useState<number>(1500000);
  const [customNominalAmount, setCustomNominalAmount] = useState<number>(0);
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('va');
  const [selectedBank, setSelectedBank] = useState<BankId>('bni');
  const [vaNumber, setVaNumber] = useState<string>('9888 1234 5678 9012');
  const [referenceNo, setReferenceNo] = useState<string>('BNI20260910103200123');
  const [transactionTime, setTransactionTime] = useState<string>('10 September 2026 | 10:32 WIB');
  const [expiryDateTime] = useState<string>('10 September 2026 | 23:59 WIB');

  // Modals state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Dynamic debtor and breakdown state
  const [debtor, setDebtor] = useState(mockDebtor);
  const [breakdown, setBreakdown] = useState(mockBreakdown);

  // Handle stage change with scroll to top
  const handleStageChange = (targetScreen: ScreenType) => {
    setCurrentScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle nominal selection
  const handleSelectNominal = (type: NominalSelectionType, amount: number) => {
    setSelectedNominalType(type);
    setSelectedAmount(amount);
    if (type === 'custom') {
      setCustomNominalAmount(amount);
    }
  };

  // Handle bank selection
  const handleSelectBank = (bank: BankId) => {
    setSelectedBank(bank);
    setVaNumber(generateVaNumber(bank));
  };

  // Channel selection from Landing page -> moves to stage 2
  const handleSelectChannelFromLanding = (channel: PaymentChannel) => {
    setSelectedChannel(channel);
    handleStageChange('nominal');
  };

  // Payment success handler -> moves to stage 6
  const handlePaymentSuccess = () => {
    const newRef = generateRefNo();
    setReferenceNo(newRef);
    const now = new Date();
    const formattedDate = `${now.getDate()} September 2026 | ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    setTransactionTime(formattedDate);

    // Deduct paid amount
    setBreakdown((prev) => ({
      ...prev,
      total: Math.max(0, prev.total - selectedAmount),
      pokok: Math.max(0, prev.pokok - Math.min(prev.pokok, selectedAmount)),
    }));

    handleStageChange('success');
  };

  // Reset to billing
  const handleBackToBilling = () => {
    handleStageChange('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased">
      {/* Top Sticky Header: Navbar with Logo BNI + Retail Collection System & Change Language Button */}
      <header className="sticky top-0 z-40 bg-white shadow-2xs">
        <Navbar
          language={language}
          onLanguageChange={setLanguage}
          onLogoClick={() => handleStageChange('landing')}
        />
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${currentScreen === 'landing' ? 'p-0' : 'max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {/* TAHAP 1: Home / Landing Screen (Matching exactly the user layout) */}
            {currentScreen === 'landing' ? (
              <LandingScreen
                debtor={debtor}
                breakdown={breakdown}
                language={language}
                onSelectChannel={handleSelectChannelFromLanding}
                onOpenDetailModal={() => setIsDetailModalOpen(true)}
                onContinue={() => handleStageChange('nominal')}
              />
            ) : (
              /* TAHAP 2 - 6: Payment Flow Screens with In-screen Stepper */
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                  {/* In-screen Stepper */}
                  <div className="bg-slate-50/60 border-b border-slate-100 px-4">
                    <Stepper
                      currentScreen={currentScreen}
                      channel={selectedChannel}
                      onStepClick={(target) => handleStageChange(target)}
                    />
                  </div>

                  {/* Active Stage Screen Content */}
                  <div className="p-4 sm:p-6">
                    {/* TAHAP 2: Pilih Nominal (Step Pertama) */}
                    {currentScreen === 'nominal' && (
                      <NominalScreen
                        breakdown={breakdown}
                        selectedType={selectedNominalType}
                        customAmount={customNominalAmount}
                        onSelectNominal={handleSelectNominal}
                        onContinue={() => handleStageChange('method')}
                        onOpenDetailModal={() => setIsDetailModalOpen(true)}
                      />
                    )}

                    {/* TAHAP 3: Pilih Metode Pembayaran */}
                    {currentScreen === 'method' && (
                      <MethodScreen
                        selectedChannel={selectedChannel}
                        selectedBank={selectedBank}
                        onSelectChannel={setSelectedChannel}
                        onSelectBank={handleSelectBank}
                        onContinue={() => handleStageChange('va')}
                        onBack={() => handleStageChange('nominal')}
                      />
                    )}

                    {/* TAHAP 4: Virtual Account & Petunjuk Transfer */}
                    {currentScreen === 'va' && (
                      <VirtualAccountScreen
                        bankId={selectedBank}
                        channel={selectedChannel}
                        vaNumber={vaNumber}
                        amount={selectedAmount}
                        expiryDateTime={expiryDateTime}
                        onContinueToWaiting={() => handleStageChange('waiting')}
                        onOpenGuideModal={() => setIsGuideModalOpen(true)}
                        onBack={() => handleStageChange('method')}
                      />
                    )}

                    {/* TAHAP 5: Status Menunggu Verifikasi Pembayaran */}
                    {currentScreen === 'waiting' && (
                      <WaitingScreen
                        channel={selectedChannel}
                        vaNumber={vaNumber}
                        amount={selectedAmount}
                        expiryDateTime={expiryDateTime}
                        onPaymentSuccess={handlePaymentSuccess}
                        onBackToHome={() => handleStageChange('landing')}
                      />
                    )}

                    {/* TAHAP 6: Pembayaran Berhasil & Resi Transaksi */}
                    {currentScreen === 'success' && (
                      <SuccessScreen
                        channel={selectedChannel}
                        referenceNo={referenceNo}
                        dateTime={transactionTime}
                        amount={selectedAmount}
                        bankId={selectedBank}
                        vaNumber={vaNumber}
                        debtor={debtor}
                        breakdown={breakdown}
                        onBackToBilling={handleBackToBilling}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Official BNI Footer with 3 Security Pillars & Wisma 46 Skyline Graphic */}
      <Footer />

      {/* Modals */}
      <BillDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        debtor={debtor}
        breakdown={breakdown}
      />

      <PaymentGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        vaNumber={vaNumber}
        channel={selectedChannel}
      />
    </div>
  );
}
