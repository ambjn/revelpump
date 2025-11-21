import { View, Text, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TokenMetadata {
  createdOn?: string;
  description?: string;
  image?: string;
  name?: string;
  showName?: string;
  symbol?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
}

interface PumpFunEvent {
  bondingCurveKey?: string;
  initialBuy?: number;
  is_mayhem_mode?: boolean;
  marketCapSol?: number;
  mint: string;
  name: string;
  pool?: string;
  signature?: string;
  solAmount?: number;
  symbol: string;
  traderPublicKey?: string;
  txType?: string;
  uri?: string;
  vSolInBondingCurve?: number;
  vTokensInBondingCurve?: number;
  metadata?: TokenMetadata;
}

interface TokenDetailModalProps {
  visible: boolean;
  token: PumpFunEvent | null;
  onClose: () => void;
}

const TokenDetailModal: React.FC<TokenDetailModalProps> = ({ visible, token, onClose }) => {
  const handleBuy = () => {
    // TODO: Implement buy logic
    console.log('Buy token:', token?.symbol);
  };

  const handleSell = () => {
    // TODO: Implement sell logic
    console.log('Sell token:', token?.symbol);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View className="flex-1 bg-white">
        {token && (
          <ScrollView className="flex-1">
            {/* Close Button */}
            <View className="flex-row justify-end px-5 pt-12">
              <TouchableOpacity onPress={onClose} className="rounded-full bg-gray-100 p-3">
                <Ionicons name="close" size={28} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Token Image - 3/4 of space */}
            <View className="items-center px-5 pt-4">
              {token.metadata?.image ? (
                <Image
                  source={{ uri: token.metadata.image }}
                  className="h-80 w-80 rounded-3xl border-4 border-gray-200"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-80 w-80 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500">
                  <Text className="text-8xl font-bold text-white" style={{ fontFamily: 'ElmsSans-Bold' }}>
                    {token.symbol.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Token Details */}
            <View className="px-5 pt-6">
              {/* Name and Symbol */}
              <Text className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'ElmsSans-Bold' }}>
                {token.name}
              </Text>
              <Text className="mt-2 text-2xl text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
                ${token.symbol}
              </Text>

              {/* Description if available */}
              {token.metadata?.description && (
                <View className="mt-4">
                  <Text className="text-lg text-gray-700" style={{ fontFamily: 'ElmsSans-Regular' }}>
                    {token.metadata.description}
                  </Text>
                </View>
              )}

              {/* Buy/Sell Buttons */}
              <View className="mt-6 flex-row gap-4">
                <TouchableOpacity
                  onPress={handleBuy}
                  className="flex-1 rounded-xl bg-green-500 px-6 py-4 shadow-lg">
                  <Text
                    className="text-center text-xl font-semibold text-white"
                    style={{ fontFamily: 'ElmsSans-SemiBold' }}>
                    Buy
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSell}
                  className="flex-1 rounded-xl bg-red-500 px-6 py-4 shadow-lg">
                  <Text
                    className="text-center text-xl font-semibold text-white"
                    style={{ fontFamily: 'ElmsSans-SemiBold' }}>
                    Sell
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Stats */}
              <View className="mt-6 rounded-2xl bg-gray-50 p-5">
                <Text
                  className="mb-4 text-xl font-semibold text-gray-900"
                  style={{ fontFamily: 'ElmsSans-SemiBold' }}>
                  Token Stats
                </Text>

                <View className="mb-4">
                  <Text
                    className="mb-1 text-base text-gray-500"
                    style={{ fontFamily: 'ElmsSans-Regular' }}>
                    Market Cap (SOL)
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ElmsSans-Bold' }}>
                    {token.marketCapSol?.toFixed(2) ?? 'N/A'}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text
                    className="mb-1 text-base text-gray-500"
                    style={{ fontFamily: 'ElmsSans-Regular' }}>
                    SOL Amount
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ElmsSans-Bold' }}>
                    {token.solAmount?.toFixed(4) ?? 'N/A'}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text
                    className="mb-1 text-base text-gray-500"
                    style={{ fontFamily: 'ElmsSans-Regular' }}>
                    Initial Buy
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ElmsSans-Bold' }}>
                    {token.initialBuy?.toLocaleString() ?? 'N/A'}
                  </Text>
                </View>

                <View>
                  <Text
                    className="mb-1 text-base text-gray-500"
                    style={{ fontFamily: 'ElmsSans-Regular' }}>
                    Pool
                  </Text>
                  <Text
                    className="text-2xl font-bold uppercase text-gray-900"
                    style={{ fontFamily: 'ElmsSans-Bold' }}>
                    {token.pool ?? 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Bonding Curve */}
              <View className="mt-6 rounded-2xl bg-gray-50 p-5">
                <Text
                  className="mb-4 text-xl font-semibold text-gray-900"
                  style={{ fontFamily: 'ElmsSans-SemiBold' }}>
                  Bonding Curve
                </Text>

                <View className="mb-4">
                  <Text
                    className="mb-1 text-base text-gray-500"
                    style={{ fontFamily: 'ElmsSans-Regular' }}>
                    vSOL in Curve
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ElmsSans-Bold' }}>
                    {token.vSolInBondingCurve?.toFixed(2) ?? 'N/A'} SOL
                  </Text>
                </View>

                <View>
                  <Text
                    className="mb-1 text-base text-gray-500"
                    style={{ fontFamily: 'ElmsSans-Regular' }}>
                    vTokens in Curve
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ElmsSans-Bold' }}>
                    {token.vTokensInBondingCurve?.toLocaleString() ?? 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Addresses */}
              <View className="mb-8 mt-6 rounded-2xl bg-gray-50 p-5">
                <Text
                  className="mb-4 text-xl font-semibold text-gray-900"
                  style={{ fontFamily: 'ElmsSans-SemiBold' }}>
                  Contract Details
                </Text>

                <View className="mb-4">
                  <Text
                    className="mb-2 text-base text-gray-500"
                    style={{ fontFamily: 'ElmsSans-Regular' }}>
                    Mint Address
                  </Text>
                  <Text className="text-base text-gray-700" style={{ fontFamily: 'ElmsSans-Regular' }}>
                    {token.mint}
                  </Text>
                </View>

                {token.traderPublicKey && (
                  <View>
                    <Text
                      className="mb-2 text-base text-gray-500"
                      style={{ fontFamily: 'ElmsSans-Regular' }}>
                      Trader Address
                    </Text>
                    <Text className="text-base text-gray-700" style={{ fontFamily: 'ElmsSans-Regular' }}>
                      {token.traderPublicKey}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default TokenDetailModal;
