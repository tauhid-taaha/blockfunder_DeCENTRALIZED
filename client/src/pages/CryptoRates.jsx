import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CryptoRates = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCryptoRates();
  }, []);

  const fetchCryptoRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:8080/api/v1/auth/crypto-rates');
      if (response.data.success) {
        setCryptoData(response.data.data);
      } else {
        setError('Failed to fetch crypto rates');
      }
    } catch (error) {
      console.error('Error fetching crypto rates:', error);
      setError(error.response?.data?.message || 'Error fetching crypto rates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cryptocurrency Rates</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go Back Home
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cryptoData.map((coin) => (
            <div
              key={coin.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <img src={coin.image} alt={coin.name} className="w-10 h-10 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold">{coin.name}</h2>
                  <p className="text-gray-500">{coin.symbol}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700">
                  Price: <span className="font-semibold">${coin.current_price.toLocaleString()}</span>
                </p>
                <p className="text-gray-700">
                  Market Cap: <span className="font-semibold">${coin.market_cap.toLocaleString()}</span>
                </p>
                <p className={coin.price_change_24h >= 0 ? "text-green-600" : "text-red-600"}>
                  24h Change: <span className="font-semibold">{coin.price_change_24h?.toFixed(2)}%</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Last Updated: {new Date(coin.last_updated).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CryptoRates; 