// pages/user/DonateNewPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createRazorpayOrder,
  createDonation,
  clearCreateSuccess,
  clearCurrentOrder,
} from "@/store/user/donation-slice";
import { DONATION_CATEGORIES, getCategoryColorClasses } from "@/config/donationCategories";
import { ArrowLeft, Heart, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DonateNewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { category: categoryFromState } = location.state || {};

  // Find the full category object including the icon
  const category = categoryFromState 
    ? DONATION_CATEGORIES.find(cat => cat.value === categoryFromState.value) 
    : null;

  const { loading, createSuccess, orderLoading } = useSelector(
    (state) => state.userDonation
  );

  const [formData, setFormData] = useState({
    category: category?.value || "",
    amount: "",
    donationType: "one_time",
    message: "",
    dedicatedTo: "",
    isAnonymous: false,
    panNumber: "",
  });

  const [selectedAmount, setSelectedAmount] = useState(null);
  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  useEffect(() => {
    if (!category) {
      navigate("/user/donations");
    }
  }, [category, navigate]);

  useEffect(() => {
    if (createSuccess) {
      dispatch(clearCreateSuccess());
      navigate("/user/donations");
    }
  }, [createSuccess, dispatch, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuickAmount = (amount) => {
    setSelectedAmount(amount);
    setFormData((prev) => ({ ...prev, amount: amount.toString() }));
  };

  const handleCustomAmount = (value) => {
    setSelectedAmount(null);
    setFormData((prev) => ({ ...prev, amount: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount || formData.amount < 1) {
      alert("Please enter a valid amount");
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load payment gateway. Please try again.");
      return;
    }

    const orderResult = await dispatch(
      createRazorpayOrder({
        amount: parseFloat(formData.amount),
        currency: "INR",
      })
    );

    if (orderResult.payload?.success) {
      const orderData = orderResult.payload.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Alumni Donation",
        description: `Donation for ${category?.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          const donationData = {
            ...formData,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            currency: "INR",
            paymentMethod: "card",
          };

          await dispatch(createDonation(donationData));
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            dispatch(clearCurrentOrder());
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      alert("Failed to create payment order. Please try again.");
    }
  };

  if (!category) return null;

  const Icon = category.icon;
  const colors = getCategoryColorClasses(category.color);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/user/donations")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Donations
          </Button>
          <div className="flex items-center gap-4">
            <div className={`p-3 ${colors.bg} rounded-xl`}>
              <Icon className={`w-8 h-8 ${colors.text}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {category.title}
              </h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Details</CardTitle>
                <CardDescription>
                  Choose your donation amount and provide additional information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Quick Amount Selection */}
                  <div className="space-y-3">
                    <Label>Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className={`h-16 text-lg font-semibold ${
                            selectedAmount === amount
                              ? "bg-blue-600 hover:bg-blue-700"
                              : ""
                          }`}
                          onClick={() => handleQuickAmount(amount)}
                        >
                          ₹{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Or Enter Custom Amount (₹) *</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleCustomAmount(e.target.value)}
                      min="1"
                      required
                      placeholder="Enter custom amount"
                      className="text-lg h-12"
                    />
                  </div>

                  {/* Donation Type */}
                  <div className="space-y-3">
                    <Label>Donation Type</Label>
                    <RadioGroup
                      value={formData.donationType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, donationType: value }))
                      }
                    >
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="one_time" id="one_time" />
                        <Label htmlFor="one_time" className="cursor-pointer flex-1">
                          <div className="font-semibold">One-Time Donation</div>
                          <div className="text-sm text-gray-600">
                            Make a single contribution
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="recurring" id="recurring" />
                        <Label htmlFor="recurring" className="cursor-pointer flex-1">
                          <div className="font-semibold">Monthly Recurring</div>
                          <div className="text-sm text-gray-600">
                            Contribute automatically each month
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* PAN Number */}
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">
                      PAN Number (for 80G tax certificate)
                    </Label>
                    <Input
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      className="uppercase"
                    />
                    <p className="text-sm text-gray-500">
                      Required for tax exemption certificate under Section 80G
                    </p>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      maxLength={500}
                      rows={4}
                      placeholder="Share why this cause matters to you..."
                    />
                    <p className="text-sm text-gray-500 text-right">
                      {formData.message.length}/500
                    </p>
                  </div>

                  {/* Dedicated To */}
                  <div className="space-y-2">
                    <Label htmlFor="dedicatedTo">
                      Dedicate This Donation (Optional)
                    </Label>
                    <Input
                      id="dedicatedTo"
                      name="dedicatedTo"
                      value={formData.dedicatedTo}
                      onChange={handleInputChange}
                      placeholder="In memory of / In honor of..."
                    />
                  </div>

                  {/* Anonymous Checkbox */}
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <Checkbox
                      id="isAnonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isAnonymous: checked }))
                      }
                    />
                    <Label
                      htmlFor="isAnonymous"
                      className="cursor-pointer flex-1"
                    >
                      <div className="font-semibold">Make donation anonymous</div>
                      <div className="text-sm text-gray-600">
                        Your name will not be displayed publicly
                      </div>
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={loading || orderLoading || !formData.amount}
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                  >
                    {loading || orderLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Donation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category</span>
                    <Badge variant="secondary">{category.title}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">
                      {formData.donationType === "one_time"
                        ? "One-Time"
                        : "Monthly"}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Amount</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{formData.amount
                          ? parseInt(formData.amount).toLocaleString()
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    100% of your donation goes directly to {category.title}
                  </AlertDescription>
                </Alert>

                <div className="pt-4 space-y-2 text-xs text-gray-600">
                  <p className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Secure payment via Razorpay</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Instant receipt generation</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>80G tax exemption certificate</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Your Impact
                </h3>
                <p className="text-sm text-gray-700">
                  Every contribution makes a lasting difference in the lives of
                  students and strengthens our institution's future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateNewPage;