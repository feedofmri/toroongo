import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, RefreshControl, Image, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';
import { messageService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius } from '../../constants/theme';

// ─── Conversations List ──────────────────────────────────────────────────────

export default function MessagesScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const res = await messageService.getConversations();
      setConversations(res.data ?? []);
    } catch (_) {
      setConversations([]);
    }
  }, []);

  useEffect(() => { fetch().finally(() => setLoading(false)); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  }, [fetch]);

  const renderConversation = ({ item }) => {
    const other = item.other_user ?? item.buyer ?? item.user ?? {};
    const lastMsg = item.last_message ?? item.latest_message ?? {};
    const unread = item.unread_count ?? 0;
    return (
      <TouchableOpacity
        style={styles.convo}
        onPress={() => navigation.navigate('Chat', { user: other, conversationId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          {other.avatar ? (
            <Image source={{ uri: other.avatar }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarText}>{(other.name ?? 'U')[0].toUpperCase()}</Text>
          )}
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </View>
        <View style={styles.convoInfo}>
          <View style={styles.convoTop}>
            <Text style={styles.convoName} numberOfLines={1}>{other.name ?? 'User'}</Text>
            <Text style={styles.convoTime}>
              {lastMsg.created_at ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>
          <Text style={[styles.convoLast, unread > 0 && styles.convoLastUnread]} numberOfLines={1}>
            {lastMsg.message ?? 'Start a conversation'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      {loading ? (
        <LoadingSpinner label="Loading conversations..." />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderConversation}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MessageCircle size={56} color={Colors.borderMedium} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptyText}>Buyer messages will appear here.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base, paddingBottom: Spacing.sm, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft },
  title: { fontSize: FontSize.xl, fontFamily: FontFamily.bold, color: Colors.textPrimary },

  list: { paddingBottom: Spacing['3xl'] },
  convo: { flexDirection: 'row', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.white },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md, position: 'relative', overflow: 'visible' },
  avatarImg: { width: 48, height: 48, borderRadius: 24 },
  avatarText: { color: Colors.white, fontSize: FontSize.lg, fontFamily: FontFamily.bold },
  badge: { position: 'absolute', top: -2, right: -4, backgroundColor: Colors.danger, borderRadius: Radius.full, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: Colors.white, fontSize: 10, fontFamily: FontFamily.bold },
  convoInfo: { flex: 1 },
  convoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convoName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary, flex: 1 },
  convoTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  convoLast: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  convoLastUnread: { color: Colors.textPrimary, fontFamily: FontFamily.medium },
  separator: { height: 1, backgroundColor: Colors.borderSoft, marginLeft: 76 },

  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted },
});
