import { View, Text, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { wssUrl } from '@/constants/constants';
import { Link } from 'expo-router';

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
    <View className="mb-4 rounded-2xl border border-gray-100 bg-white p-4">
      {/* Header Section */}
      <View className="mb-3 flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'ElmsSans-Regular' }}>
            {item.name}
          </Text>
          <Text className="mt-1 text-sm text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
            ${item.symbol}
          </Text>
        </View>
        {item.metadata?.image ? (
          <Image
            source={{ uri: item.metadata.image }}
            className="h-16 w-16 rounded-full border-2 border-gray-200"
            resizeMode="cover"
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
            <Text
              className="text-2xl font-bold text-white"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              {item.symbol.substring(0, 2).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Stats Grid */}
      <View className="mb-3 rounded-xl bg-gray-50 p-3">
        <View className="mb-2 flex-row justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              Market Cap (SOL)
            </Text>
            <Text
              className="text-base font-semibold text-gray-900"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              {item.marketCapSol?.toFixed(2) ?? 'N/A'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              SOL Amount
            </Text>
            <Text
              className="text-base font-semibold text-gray-900"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              {item.solAmount?.toFixed(4) ?? 'N/A'}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              Initial Buy
            </Text>
            <Text
              className="text-base font-semibold text-gray-900"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              {item.initialBuy?.toLocaleString() ?? 'N/A'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              Pool
            </Text>
            <Text
              className="text-base font-semibold uppercase text-gray-900"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              {item.pool ?? 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bonding Curve Info */}
      <View className="mb-3">
        <Text className="mb-1 text-xs text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
          vSOL in Curve: {item.vSolInBondingCurve?.toFixed(2) ?? 'N/A'} SOL
        </Text>
        <Text className="text-xs text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
          vTokens: {item.vTokensInBondingCurve?.toLocaleString() ?? 'N/A'}
        </Text>
      </View>

      {/* Addresses */}
      <View className="border-t border-gray-200 pt-3">
        <View className="mb-2">
          <Text className="mb-1 text-xs text-gray-400" style={{ fontFamily: 'ElmsSans-Regular' }}>
            Mint Address
          </Text>
          <Text
            className="font-mono text-xs text-gray-700"
            style={{ fontFamily: 'ElmsSans-Regular' }}>
            {item.mint?.length > 30
              ? `${item.mint.substring(0, 20)}...${item.mint.substring(item.mint.length - 10)}`
              : item.mint}
          </Text>
        </View>
        {item.traderPublicKey && (
          <View>
            <Text className="mb-1 text-xs text-gray-400" style={{ fontFamily: 'ElmsSans-Regular' }}>
              Trader
            </Text>
            <Text
              className="font-mono text-xs text-gray-700"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              {item.traderPublicKey.length > 30
                ? `${item.traderPublicKey.substring(0, 20)}...${item.traderPublicKey.substring(item.traderPublicKey.length - 10)}`
                : item.traderPublicKey}
            </Text>
          </View>
        )}
      </View>

      {/* Mayhem Mode Badge */}
      {item.is_mayhem_mode && (
        <View className="mt-3 rounded-lg bg-red-100 px-3 py-2">
          <Text
            className="text-center text-xs font-semibold text-red-700"
            style={{ fontFamily: 'ElmsSans-Regular' }}>
            🔥 MAYHEM MODE ACTIVE
          </Text>
        </View>
      )}
    </View>
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
    </View>
  );
};

export default Home;
