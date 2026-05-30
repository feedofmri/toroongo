import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import { reviewService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius, Shadow } from '../../constants/theme';

function Stars({ rating, size = 14 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          color={i <= rating ? '#F59E0B' : Colors.borderMedium}
          fill={i <= rating ? '#F59E0B' : 'transparent'}
          strokeWidth={1.5}
        />
      ))}
    </View>
  );
}

function ReviewCard({ item }) {
  const rating = item.rating ?? 0;
  const reviewer = item.user?.name ?? item.buyer?.name ?? 'Customer';
  const product = item.product?.name ?? item.product_name ?? '';
  const comment = item.comment ?? item.body ?? '';
  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <View style={[styles.card, Shadow.sm]}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{reviewer[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewer}>{reviewer}</Text>
          {product ? <Text style={styles.product} numberOfLines={1}>{product}</Text> : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Stars rating={rating} />
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      {comment ? <Text style={styles.comment}>{comment}</Text> : null}
    </View>
  );
}

export default function ReviewsScreen({ navigation }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await reviewService.listSeller();
      const data = res.data?.data ?? res.data ?? [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (_) { setReviews([]); }
  }, []);

  useEffect(() => { fetchReviews().finally(() => setLoading(false)); }, [fetchReviews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReviews();
    setRefreshing(false);
  }, [fetchReviews]);

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length : 0;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
        <View style={{ width: 38 }} />
      </View>

      {reviews.length > 0 && (
        <View style={styles.summaryBar}>
          <Stars rating={Math.round(avgRating)} size={18} />
          <Text style={styles.summaryText}>{avgRating.toFixed(1)} avg · {reviews.length} reviews</Text>
        </View>
      )}

      <FlatList
        data={reviews}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ReviewCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Star size={56} color={Colors.borderMedium} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptyText}>Customer reviews will appear here once orders are completed.</Text>
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
  summaryBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.white, paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.borderSoft,
  },
  summaryText: { fontSize: FontSize.sm, color: Colors.textMuted, fontFamily: FontFamily.medium },
  list: { padding: Spacing.base, gap: Spacing.sm, paddingBottom: Spacing['3xl'] },
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.borderSoft, gap: Spacing.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.primary, fontFamily: FontFamily.bold, fontSize: FontSize.base },
  reviewer: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  product: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 1 },
  date: { fontSize: FontSize.xs, color: Colors.textLight },
  comment: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  empty: { alignItems: 'center', paddingTop: Spacing['4xl'], paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontFamily: FontFamily.semibold, color: Colors.textPrimary },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});
