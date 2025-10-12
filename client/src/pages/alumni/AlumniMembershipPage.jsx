import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, X, Clock, Crown, AlertCircle, Loader } from 'lucide-react';
import { 
  getMembershipInfo, 
  getMyMembershipStatus, 
  createMembershipOrder,
  purchaseMembership 
} from '@/store/user/membership-slice';

const AlumniMembershipPage = () => {
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useSelector(state => state.auth);
  console.log(user)

  const { 
    loading, 
    orderLoading,
    membershipInfo, 
    myStatus, 
    currentOrder,
    purchaseSuccess,
    error 
  } = useSelector(state => state.userMembership);

  useEffect(() => {
    dispatch(getMembershipInfo());
    dispatch(getMyMembershipStatus(user));
  }, [dispatch]);

  const handleBuyMembership = async (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    if (!selectedPlan) return;

    try {
      // Step 1: Create order
      const orderResult = await dispatch(createMembershipOrder({ 
        planType: selectedPlan.type 
      }));

      if (orderResult.payload?.data) {
        const { orderId, key } = orderResult.payload.data;

        // Step 2: Initialize Razorpay payment
        const options = {
          key: key,
          amount: selectedPlan.price * 100,
          currency: 'INR',
          order_id: orderId,
          name: 'Alumni Association Membership',
          description: `${selectedPlan.name} - ₹${selectedPlan.price}`,
          handler: function (response) {
            // Step 3: Handle successful payment
            dispatch(purchaseMembership({
              planType: selectedPlan.type,
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentMethod: 'card'
            }));
            setShowPaymentModal(false);
          },
          prefill: {
            name: myStatus?.currentMembership?.membershipId || 'Alumni',
            email: myStatus?.membershipHistory?.[0]?.email || ''
          },
          theme: {
            color: '#2563eb'
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading membership information...</p>
        </div>
      </div>
    );
  }

  const hasActiveMembership = myStatus?.hasActiveMembership;
  const activeMembershipData = myStatus?.activeMembership;
  const benefits = membershipInfo?.benefits || [];
  const plans = membershipInfo?.plans || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Alumni Association Membership</h1>
          <p className="text-lg text-slate-600">Join our community and unlock exclusive benefits</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {purchaseSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Success!</p>
              <p className="text-green-800 text-sm">Your membership has been activated successfully.</p>
            </div>
          </div>
        )}

        {/* Active Membership Card */}
        {hasActiveMembership && activeMembershipData && (
          <div className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Active Membership</h2>
                  <p className="text-slate-600 mb-4">Your membership is currently active and in good standing</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Plan Type</p>
                      <p className="text-lg font-semibold text-slate-900 capitalize">{activeMembershipData.planType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Amount Paid</p>
                      <p className="text-lg font-semibold text-slate-900">₹{activeMembershipData.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Start Date</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {new Date(activeMembershipData.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Expiry Date</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {new Date(activeMembershipData.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Membership Benefits</h2>
          <p className="text-slate-600 mb-8">What you get with your alumni membership</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{benefit.icon || '✨'}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        {!hasActiveMembership && plans.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Plan</h2>
            <p className="text-slate-600 mb-8">Select the membership plan that works best for you</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.type}
                  className={`relative rounded-lg border-2 transition-all ${
                    plan.badge
                      ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:shadow-md'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 text-sm mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-slate-900">₹{plan.price}</div>
                      <p className="text-slate-600 text-sm mt-1">{plan.duration}</p>
                    </div>
                    
                    <button
                      onClick={() => handleBuyMembership(plan)}
                      disabled={orderLoading}
                      className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        plan.badge
                          ? 'bg-amber-400 text-slate-900 hover:bg-amber-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {orderLoading && <Loader className="w-4 h-4 animate-spin" />}
                      Purchase Now
                    </button>
                    
                    <div className="space-y-3">
                      {plan.benefits?.map?.((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasActiveMembership && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">You're All Set!</h3>
            <p className="text-slate-600">Enjoy all the exclusive benefits that come with your membership. If you'd like to upgrade or extend your membership, please contact the alumni office.</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirm Purchase</h2>
            <p className="text-slate-600 mb-6">You're about to purchase the following membership:</p>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">Plan</span>
                <span className="font-semibold text-slate-900">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">Duration</span>
                <span className="font-semibold text-slate-900">{selectedPlan.duration}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                <span className="text-slate-600 font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">₹{selectedPlan.price}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">You will be redirected to a secure payment gateway to complete your purchase.</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={orderLoading}
                className="flex-1 py-2 px-4 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentConfirm}
                disabled={orderLoading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {orderLoading && <Loader className="w-4 h-4 animate-spin" />}
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
    </div>
  );
};

export default AlumniMembershipPage;