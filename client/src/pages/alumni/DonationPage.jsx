// pages/user/DonationPage.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDonationCategoryStats,
  getMyDonationStats,
  downloadReceipt,
} from "@/store/user/donation-slice";
import {
  DONATION_CATEGORIES,
  getCategoryByValue,
  getCategoryColorClasses
} from "@/config/donationCategories";
import {
  Heart,
  TrendingUp,
  Award,
  Download,
  DollarSign,
  ArrowRight,
  Users,
  Target,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const AlumniDonationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryStats, stats, loading } = useSelector((state) => state.userDonation);

  useEffect(() => {
    dispatch(getDonationCategoryStats());
    dispatch(getMyDonationStats());
  }, [dispatch]);

  const handleCategorySelect = (category) => {
    // Only pass serializable data (exclude icon component)
    const { icon, ...serializableCategory } = category;
    navigate('/alumni/donate/new', { state: { category: serializableCategory } });
  };

  const handleDownloadReceipt = async (donationId) => {
    const result = await dispatch(downloadReceipt(donationId));
    if (result.payload?.data?.receiptUrl) {
      window.open(result.payload.data.receiptUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="text-center space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              Transform Lives Through Education
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Make a Difference
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Support your alma mater and help shape the future of education for the next generation
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}
              >
                Start Donating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* My Impact Stats */}
        {stats && stats.overview.totalDonations > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Your Impact</h2>
              <p className="text-gray-600 mt-2">Thank you for your generous contributions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">Total Donated</p>
                      <p className="text-3xl font-bold mt-1">
                        ₹{stats.overview.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Heart className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">Total Donations</p>
                      <p className="text-3xl font-bold mt-1">
                        {stats.overview.totalDonations}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium opacity-90">Average Gift</p>
                      <p className="text-3xl font-bold mt-1">
                        ₹{stats.overview.averageDonation.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Donation Categories */}
        <div id="categories" className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Cause</h2>
            <p className="text-gray-600 mt-2">Select a category that resonates with you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DONATION_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const colors = getCategoryColorClasses(category.color);
              const stats = categoryStats[category?.value] || { totalRaised: 0, donorCount: 0 };

              return (
                <Card
                  key={category.value}
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200 overflow-hidden"
                  onClick={() => handleCategorySelect(category)}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 ${colors.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-medium">Raised</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₹{stats.totalRaised.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-4">{category.title}</CardTitle>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{stats.donorCount} donors</span>
                      </div>
                      <Button variant="ghost" className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                        Donate <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Your Contributions</h2>
              <p className="text-gray-600 mt-2">Breakdown by category</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.categoryBreakdown.map((item) => {
                const categoryInfo = getCategoryByValue(item._id);
                const colors = getCategoryColorClasses(categoryInfo?.color || 'gray');
                const Icon = categoryInfo?.icon || Award;

                return (
                  <Card key={item._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${colors.bg} rounded-xl`}>
                          <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{item.total.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.count} donation{item.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {categoryInfo?.title || item._id}
                      </h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Donations */}
        {stats?.recentDonations && stats.recentDonations.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Recent Donations</h2>
              <p className="text-gray-600 mt-2">Your donation history</p>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {stats.recentDonations.map((donation) => {
                      const categoryInfo = getCategoryByValue(donation.category);
                      return (
                        <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                            {new Date(donation.donationDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {categoryInfo?.title || donation.category}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            ₹{donation.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={donation.paymentStatus === "completed" ? "default" : "secondary"}
                              className={
                                donation.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {donation.paymentStatus}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {donation.receiptUrl ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadReceipt(donation._id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-400">Pending</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        {(!stats || stats.overview.totalDonations === 0) && (
          <Card className="border-none shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Your contribution, no matter the size, helps create opportunities and transform lives
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                onClick={() => document.getElementById('categories').scrollIntoView({ behavior: 'smooth' })}
              >
                Choose a Category
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AlumniDonationPage;