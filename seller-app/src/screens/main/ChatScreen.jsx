import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { messageService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, FontFamily, Spacing, Radius } from '../../constants/theme';

export default function ChatScreen({ navigation, route }) {
  const { user: chatUser } = route.params;
  const { user: me } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await messageService.getMessages(chatUser.id);
      setMessages((res.data ?? []).reverse());
    } catch (_) {
      setMessages([]);
    }
  }, [chatUser.id]);

  useEffect(() => { fetchMessages().finally(() => setLoading(false)); }, []);

  const send = useCallback(async () => {
    const msg = text.trim();
    if (!msg || sending) return;
    setSending(true);
    setText('');
    const temp = { id: `temp-${Date.now()}`, message: msg, sender_id: me?.id, created_at: new Date().toISOString(), pending: true };
    setMessages((prev) => [temp, ...prev]);
    try {
      const res = await messageService.sendMessage(chatUser.id, msg);
      setMessages((prev) => prev.map((m) => (m.id === temp.id ? { ...res.data, pending: false } : m)));
    } catch (_) {
      Alert.alert('Error', 'Message could not be sent.');
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
    } finally {
      setSending(false);
    }
  }, [text, sending, me, chatUser.id]);

  const renderMessage = ({ item }) => {
    const isMine = item.sender_id === me?.id;
    return (
      <View style={[styles.msgRow, isMine && styles.msgRowMine]}>
        {!isMine && (
          <View style={styles.msgAvatar}>
            {chatUser.avatar ? (
              <Image source={{ uri: chatUser.avatar }} style={styles.msgAvatarImg} />
            ) : (
              <Text style={styles.msgAvatarText}>{(chatUser.name ?? 'U')[0]}</Text>
            )}
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther, item.pending && styles.bubblePending]}>
          <Text style={[styles.bubbleText, isMine && styles.bubbleTextMine]}>{item.message}</Text>
          <Text style={[styles.bubbleTime, isMine && styles.bubbleTimeMine]}>
            {item.pending ? 'Sending…' : (item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerUser}>
          <View style={styles.headerAvatar}>
            {chatUser.avatar ? (
              <Image source={{ uri: chatUser.avatar }} style={styles.headerAvatarImg} />
            ) : (
              <Text style={styles.headerAvatarText}>{(chatUser.name ?? 'U')[0].toUpperCase()}</Text>
            )}
          </View>
          <Text style={styles.headerName} numberOfLines={1}>{chatUser.name ?? 'User'}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={0}
      >
        {loading ? (
          <LoadingSpinner label="Loading messages..." />
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMessage}
            contentContainerStyle={styles.msgList}
            inverted
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyChat}>
                <Text style={styles.emptyChatText}>Start the conversation!</Text>
              </View>
            }
          />
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textLight}
            value={text}
            onChangeText={setText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
            onPress={send}
            disabled={!text.trim() || sending}
          >
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderSoft,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.sm },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  headerAvatarImg: { width: 36, height: 36, borderRadius: 18 },
  headerAvatarText: { color: Colors.white, fontFamily: FontFamily.bold },
  headerName: { fontSize: FontSize.base, fontFamily: FontFamily.semibold, color: Colors.textPrimary, flex: 1 },

  msgList: { padding: Spacing.base, paddingBottom: Spacing.lg },
  msgRow: { flexDirection: 'row', marginBottom: Spacing.sm, alignItems: 'flex-end' },
  msgRowMine: { flexDirection: 'row-reverse' },
  msgAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm },
  msgAvatarImg: { width: 30, height: 30, borderRadius: 15 },
  msgAvatarText: { color: Colors.white, fontSize: FontSize.xs, fontFamily: FontFamily.bold },
  bubble: { maxWidth: '75%', borderRadius: Radius.lg, padding: Spacing.md },
  bubbleMine: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: Colors.borderSoft },
  bubblePending: { opacity: 0.7 },
  bubbleText: { fontSize: FontSize.base, color: Colors.textPrimary },
  bubbleTextMine: { color: Colors.white },
  bubbleTime: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: 4, textAlign: 'right' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.65)' },

  emptyChat: { alignItems: 'center', paddingTop: Spacing['3xl'] },
  emptyChatText: { fontSize: FontSize.sm, color: Colors.textMuted },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.borderSoft,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1, minHeight: 40, maxHeight: 120,
    backgroundColor: Colors.surfaceAlt, borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md, paddingVertical: 9,
    fontSize: FontSize.base, color: Colors.textPrimary,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.borderMedium },
  sendBtnText: { color: Colors.white, fontSize: FontSize.lg, fontFamily: FontFamily.bold },
});
