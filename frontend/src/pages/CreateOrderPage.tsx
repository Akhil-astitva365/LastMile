import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api';
import { OrderQuoteResponse, OrderType, PaymentType } from '../types';
import { LocationAutocompleteInput } from '../components/LocationAutocompleteInput';
import { Calculator, Package, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();

  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [length, setLength] = useState<number>(30);
  const [breadth, setBreadth] = useState<number>(20);
  const [height, setHeight] = useState<number>(15);
  const [actualWeight, setActualWeight] = useState<number>(2.5);
  const [orderType, setOrderType] = useState<OrderType>('B2C');
  const [paymentType, setPaymentType] = useState<PaymentType>('COD');

  const [quote, setQuote] = useState<OrderQuoteResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCalculateQuote = async () => {
    if (!pickupAddress || !dropAddress) {
      setErrorMessage('Please fill in both pickup and drop addresses');
      return;
    }
    setErrorMessage(null);
    setIsCalculating(true);
    try {
      const res = await orderApi.getQuote({
        pickupAddress,
        dropAddress,
        length,
        breadth,
        height,
        actualWeight,
        orderType,
        paymentType,
      });
      setQuote(res);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to calculate quote');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await orderApi.createOrder({
        pickupAddress,
        dropAddress,
        length,
        breadth,
        height,
        actualWeight,
        orderType,
        paymentType,
      });
      navigate('/customer');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/customer')}
          className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </button>
        <h2 className="text-xl font-bold text-white tracking-wide">NEW SHIPPING ORDER</h2>
      </div>

      <div className="ios-glass-panel p-6 sm:p-8 rounded-3xl space-y-6 bg-black/95 border border-neutral-800 shadow-2xl">
        <div className="border-b border-neutral-800 pb-4">
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-white" /> Volumetric Rate Calculator & Order Form
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            Dynamic pricing engine automatically calculates volumetric & billable weight for PAN-India routes.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-700 text-white text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Order Warning</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleCreateOrder} className="space-y-6 text-xs">
          {/* Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LocationAutocompleteInput
              label="Pickup Address / City / Pincode"
              value={pickupAddress}
              onChange={(val) => setPickupAddress(val)}
              placeholder="e.g. Bhopal, Connaught Place Delhi 110001..."
              required
            />
            <LocationAutocompleteInput
              label="Drop Address / City / Pincode"
              value={dropAddress}
              onChange={(val) => setDropAddress(val)}
              placeholder="e.g. Indore, Bandra West Mumbai 400050..."
              required
            />
          </div>

          {/* Dimensions */}
          <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
            <div className="font-bold text-white text-xs flex items-center gap-2">
              <Package className="w-4 h-4 text-white" /> Package Specs (Volumetric Formula: L×B×H / 5000)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase font-bold mb-1">Length (cm)</label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full ios-input rounded-xl px-3 py-2 text-white font-medium"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase font-bold mb-1">Breadth (cm)</label>
                <input
                  type="number"
                  value={breadth}
                  onChange={(e) => setBreadth(Number(e.target.value))}
                  className="w-full ios-input rounded-xl px-3 py-2 text-white font-medium"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase font-bold mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full ios-input rounded-xl px-3 py-2 text-white font-medium"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase font-bold mb-1">Actual Wt (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(Number(e.target.value))}
                  className="w-full ios-input rounded-xl px-3 py-2 text-white font-medium"
                  min={0.1}
                  required
                />
              </div>
            </div>

            {/* Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase font-bold mb-1">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as OrderType)}
                  className="w-full ios-input rounded-xl px-3 py-2 text-white font-medium"
                >
                  <option value="B2C">B2C (Retail Delivery)</option>
                  <option value="B2B">B2B (Enterprise Freight)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 text-[10px] uppercase font-bold mb-1">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                  className="w-full ios-input rounded-xl px-3 py-2 text-white font-medium"
                >
                  <option value="COD">Cash On Delivery (COD)</option>
                  <option value="PREPAID">Prepaid Online</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculateQuote}
              disabled={isCalculating}
              className="w-full py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold hover:bg-neutral-800 transition-all text-xs"
            >
              {isCalculating ? 'Calculating Quote...' : 'Calculate Volumetric Rate Quote'}
            </button>
          </div>

          {/* Quote Output Preview */}
          {quote && (
            <div className="p-5 rounded-2xl bg-neutral-950 border border-white/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-white font-bold border-b border-neutral-800 pb-2">
                <span>VOLUMETRIC RATE QUOTE ESTIMATE</span>
                <span className="text-lg text-white font-bold">₹{quote.finalCharge}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-300 text-[11px]">
                <div>Route: <b className="text-white">{quote.zoneType}</b></div>
                <div>Vol Wt: <b className="text-white">{quote.volumetricWeight} kg</b></div>
                <div>Billable Wt: <b className="text-white">{quote.billableWeight} kg</b></div>
                <div>COD Fee: <b className="text-white">₹{quote.codSurcharge}</b></div>
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full ios-button-primary text-black font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};
