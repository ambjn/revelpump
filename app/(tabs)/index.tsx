import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { wssUrl } from '@/constants/constants';
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

const Home = () => {
  const ws = useRef<WebSocket | null>(null);
  const [events, setEvents] = useState<PumpFunEvent[]>([]);
  const [selectedToken, setSelectedToken] = useState<PumpFunEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(wssUrl);

    ws.current.onopen = () => {
      console.log('pump ws connected');
      ws.current?.send(JSON.stringify({ method: 'subscribeNewToken' }));
      ws.current?.send(JSON.stringify({ method: 'subscribeMigration' }));
    };

    ws.current.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.mint && data.name && data.symbol) {
          if (data.uri) {
            try {
              const metadataResponse = await fetch(data.uri);
              const metadata = await metadataResponse.json();
              data.metadata = metadata;
            } catch (metaError) {
              console.log('Metadata fetch error:', metaError);
            }
          }
          setEvents((prev) => [data, ...prev]);
        }
      } catch (e) {
        console.log('error:', e);
      }
    };

    ws.current.onerror = (error) => {
      console.log('ws rrror:', error);
    };

    ws.current.onclose = () => {
      console.log('pump ws closed');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const renderItem = ({ item }: { item: PumpFunEvent }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedToken(item);
        setModalVisible(true);
      }}
      className="mb-4 rounded-2xl border border-gray-100 bg-white p-5">
      <View className="mb-4 flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'ElmsSans-SemiBold' }}>
            {item.name}
          </Text>
          <Text className="mt-2 text-lg text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
            ${item.symbol}
          </Text>
        </View>
        {item.metadata?.image ? (
          <Image
            source={{ uri: item.metadata.image }}
            className="h-20 w-20 rounded-full border-2 border-gray-200"
            resizeMode="cover"
          />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
            <Text
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              {item.symbol.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View className="mb-4 rounded-xl bg-gray-50 p-4">
        <View className="mb-3 flex-row justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              Market Cap (SOL)
            </Text>
            <Text
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: 'ElmsSans-SemiBold' }}>
              {item.marketCapSol?.toFixed(2) ?? 'N/A'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              SOL Amount
            </Text>
            <Text
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: 'ElmsSans-SemiBold' }}>
              {item.solAmount?.toFixed(4) ?? 'N/A'}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              Initial Buy
            </Text>
            <Text
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: 'ElmsSans-SemiBold' }}>
              {item.initialBuy?.toLocaleString() ?? 'N/A'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-sm text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              Pool
            </Text>
            <Text
              className="text-lg font-semibold uppercase text-gray-900"
              style={{ fontFamily: 'ElmsSans-SemiBold' }}>
              {item.pool ?? 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {item.is_mayhem_mode && (
        <View className="mt-3 rounded-lg bg-red-100 px-3 py-2">
          <Text
            className="text-center text-sm font-semibold text-red-700"
            style={{ fontFamily: 'ElmsSans-Regular' }}>
            🔥 MAYHEM MODE ACTIVE
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="border-b border-gray-200 bg-white px-5 pb-4 pt-16">
        <Text className="text-5xl text-gray-900" style={{ fontFamily: 'ElmsSans-SemiBold' }}>
          {'RevelPump\nLive'}
        </Text>
        <Text className="mt-2 text-xl text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
          realtime token events • {events.length} events 🚀
        </Text>
      </View>

      <View className="flex-1 px-5 pt-4">
        {events.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#EF372EFF" />
          </View>
        ) : (
          <FlashList
            data={events}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-white">
          {selectedToken && (
            <ScrollView className="flex-1">
              <View className="flex-row justify-end px-5 pt-12">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="rounded-full bg-gray-100 p-3">
                  <Ionicons name="close" size={28} color="#374151" />
                </TouchableOpacity>
              </View>

              <View className="items-center px-5 pt-4">
                {selectedToken.metadata?.image ? (
                  <Image
                    source={{ uri: selectedToken.metadata.image }}
                    className="h-80 w-80 rounded-3xl border-4 border-gray-200"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-80 w-80 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500">
                    <Text
                      className="text-8xl font-bold text-white"
                      style={{ fontFamily: 'ElmsSans-Bold' }}>
                      {selectedToken.symbol.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              <View className="px-5 pt-6">
                <Text
                  className="text-4xl font-bold text-gray-900"
                  style={{ fontFamily: 'ElmsSans-Bold' }}>
                  {selectedToken.name}
                </Text>
                <Text
                  className="mt-2 text-2xl text-gray-500"
                  style={{ fontFamily: 'ElmsSans-Regular' }}>
                  ${selectedToken.symbol}
                </Text>

                {selectedToken.metadata?.description && (
                  <View className="mt-4">
                    <Text
                      className="text-lg text-gray-700"
                      style={{ fontFamily: 'ElmsSans-Regular' }}>
                      {selectedToken.metadata.description}
                    </Text>
                  </View>
                )}

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
                    <Text
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: 'ElmsSans-Bold' }}>
                      {selectedToken.marketCapSol?.toFixed(2) ?? 'N/A'}
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text
                      className="mb-1 text-base text-gray-500"
                      style={{ fontFamily: 'ElmsSans-Regular' }}>
                      SOL Amount
                    </Text>
                    <Text
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: 'ElmsSans-Bold' }}>
                      {selectedToken.solAmount?.toFixed(4) ?? 'N/A'}
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text
                      className="mb-1 text-base text-gray-500"
                      style={{ fontFamily: 'ElmsSans-Regular' }}>
                      Initial Buy
                    </Text>
                    <Text
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: 'ElmsSans-Bold' }}>
                      {selectedToken.initialBuy?.toLocaleString() ?? 'N/A'}
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
                      {selectedToken.pool ?? 'N/A'}
                    </Text>
                  </View>
                </View>

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
                    <Text
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: 'ElmsSans-Bold' }}>
                      {selectedToken.vSolInBondingCurve?.toFixed(2) ?? 'N/A'} SOL
                    </Text>
                  </View>

                  <View>
                    <Text
                      className="mb-1 text-base text-gray-500"
                      style={{ fontFamily: 'ElmsSans-Regular' }}>
                      vTokens in Curve
                    </Text>
                    <Text
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: 'ElmsSans-Bold' }}>
                      {selectedToken.vTokensInBondingCurve?.toLocaleString() ?? 'N/A'}
                    </Text>
                  </View>
                </View>

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
                    <Text
                      className="text-base text-gray-700"
                      style={{ fontFamily: 'ElmsSans-Regular' }}>
                      {selectedToken.mint}
                    </Text>
                  </View>

                  {selectedToken.traderPublicKey && (
                    <View>
                      <Text
                        className="mb-2 text-base text-gray-500"
                        style={{ fontFamily: 'ElmsSans-Regular' }}>
                        Trader Address
                      </Text>
                      <Text
                        className="text-base text-gray-700"
                        style={{ fontFamily: 'ElmsSans-Regular' }}>
                        {selectedToken.traderPublicKey}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Home;
