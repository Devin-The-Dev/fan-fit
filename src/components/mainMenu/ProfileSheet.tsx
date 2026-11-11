import { useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isSameHeight, isSameWeight } from '../../lib/units';
import type { Gender, ProfileDetails } from '../../types';
import type { Option } from './OptionGroup';
import { ProfileForm } from './ProfileForm';

interface Props {
  visible: boolean;
  details: ProfileDetails;
  genderOptions: Option<Gender>[];
  onSave: (details: ProfileDetails) => void;
  onClose: () => void;
}

const DISCARD_TITLE = 'Discard changes?';
const DISCARD_MESSAGE = "Your profile changes won't be saved if you close now.";

function hasChanges(draft: ProfileDetails, saved: ProfileDetails): boolean {
  return (
    draft.name !== saved.name ||
    draft.age !== saved.age ||
    draft.gender !== saved.gender ||
    draft.units !== saved.units ||
    !isSameHeight(draft.heightCm, saved.heightCm) ||
    !isSameWeight(draft.weightKg, saved.weightKg)
  );
}

function confirmDiscard(onDiscard: () => void) {
  // react-native-web's Alert is a no-op, so the web build uses the browser's confirm dialog.
  if (Platform.OS === 'web') {
    if (globalThis.confirm(`${DISCARD_TITLE}\n\n${DISCARD_MESSAGE}`)) onDiscard();
    return;
  }
  Alert.alert(DISCARD_TITLE, DISCARD_MESSAGE, [
    { text: 'Keep editing', style: 'cancel' },
    { text: 'Discard', style: 'destructive', onPress: onDiscard },
  ]);
}

export function ProfileSheet({ visible, details, genderOptions, onSave, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(details);
  const [wasVisible, setWasVisible] = useState(visible);

  // Reset the draft during render when the sheet opens, so the first frame never shows discarded edits.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setDraft(details);
  }

  const updateDraft = (patch: Partial<ProfileDetails>) => setDraft((current) => ({ ...current, ...patch }));

  const save = () => {
    onSave(draft);
    onClose();
  };

  const requestClose = () => {
    if (hasChanges(draft, details)) confirmDiscard(onClose);
    else onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={requestClose}>
      <View className="flex-1 justify-end bg-overlay">
        <Pressable className="flex-1" onPress={requestClose} accessibilityLabel="Close profile" />
        <View
          className="max-h-[92%] px-screen-x pt-6 rounded-t-[28px] border-t border-border bg-background"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-text text-[22px] font-extrabold">Profile</Text>
            <Pressable onPress={requestClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
              <Text className="text-text-muted text-[20px]">✕</Text>
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <ProfileForm draft={draft} genderOptions={genderOptions} onChange={updateDraft} />
          </ScrollView>

          <Pressable
            onPress={save}
            accessibilityRole="button"
            className="mt-6 py-[18px] items-center rounded-lg bg-accent active:bg-accent-pressed"
          >
            <Text className="text-text-on-accent text-[18px] font-extrabold">Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
