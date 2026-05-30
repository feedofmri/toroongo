import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, BellOff, Trash2 } from 'lucide-react-native';
import { notificationService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

function NotifItem({ item, onDelete }) {
  const isRead = !!item.read_at;
  return (
    <View style={[styles.card, !isRead && styles.cardUnread, Shadow.sm]}>
      <View style={[styles.iconBox, { backgroundColor: isRead ? Colors.surfaceAlt : Colors.primaryMuted }]}>
        <Bell size={18} color={isRead ? Colors.textMuted : Colors.primary} strokeWidth={2} />
      </View>
      <View style={styles.body}>
        {item.title || item.data?.title ? (
          <Text style={[styles.notifTitle, !isRead && { color: Colors.textPrimary }]}>
            {item.title ?? item.data?.title}
          </Text>
        ) : null}
        <Text style={styles.notifText} numberOfLines={2}>
          {item.message ?? item.body ?? item.data?.message ?? 'New notification'}
        </Text>
        {item.created_at ? (
          <Text style={styles.notifTime}>
            {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Trash2 size={16} color={Colors.danger} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationService.list();
      const data = res.data?.data ?? res.data ?? [];
      setNotifications(Array.isArray(data) ? data : []);
    } catch (_) { setNotifications([]); }
  }, []);

  useEffect(() => { fetchNotifications().finally(() => setLoading(false)); }, [fetchNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
    } catch (_) { Alert.alert('Error', 'Could not mark as read.'); }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (_) { Alert.alert('Error', 'Could not delete notification.'); }
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markBtn}>
            <Text style={styles.markBtnText}>Mark all read</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 80 }} />}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <NotifItem item={item} onDelete={handleDelete} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <BellOff size={56} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>You're all caught up!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft,
  },
  backBtn: { padding: Spacing.xs },
  title: { flex: 1, fontSize: FontSize.lg, fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center' },
  markBtn: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  markBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontFamily: FontFamily.medium },
  list: { padding: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing['3xl'] },
  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft, gap: Spacing.sm,
  },
  cardUnread: { borderColor: Colors.primary + '40', backgroundColor: Colors.primaryMuted + '40' },
  iconBox: { width: 38, height: 38, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
  notifTitle: { fontSize: FontSize.sm, fontFamily: FontFamily.semibold, color: Colors.textSecondary, marginBottom: 2 },
  notifText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },
  notifTime: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted },
});
