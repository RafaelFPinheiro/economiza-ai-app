import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type DeleteExpenseDialogProps = {
  visible: boolean;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteExpenseDialog({ visible, description, onCancel, onConfirm }: DeleteExpenseDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Excluir despesa?</Text>
          <Text style={styles.message}>Deseja remover “{description}” da lista de despesas?</Text>

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Excluir</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 24, 40, 0.35)'
  },
  card: {
    width: '86%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8
  },
  message: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 22
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 96,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#F2F4F7'
  },
  confirmButton: {
    backgroundColor: '#B42318'
  },
  cancelText: {
    color: '#101828',
    fontWeight: '600'
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '600'
  }
});
