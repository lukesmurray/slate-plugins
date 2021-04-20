import { useCallback } from 'react';
import { getBlockAbove, SPEditor } from '@udecode/slate-plugins';
import { BaseEmoji } from 'emoji-mart';
import { Editor, Transforms } from 'slate';
import { IComboboxItem } from '../../combobox/components/Combobox.types';
import { useComboboxIsOpen } from '../../combobox/selectors/useComboboxIsOpen';
import { useComboboxStore } from '../../combobox/useComboboxStore';

/**
 * Select the target range, add a tag node and set the target range to null
 */
export const useEmojiOnSelectItem = () => {
  const isOpen = useComboboxIsOpen();
  const targetRange = useComboboxStore((state) => state.targetRange);
  const closeMenu = useComboboxStore((state) => state.closeMenu);

  return useCallback(
    (editor: SPEditor, item: IComboboxItem) => {
      if (isOpen && targetRange) {
        const pathAbove = getBlockAbove(editor)?.[1];
        const isBlockEnd =
          editor.selection &&
          pathAbove &&
          Editor.isEnd(editor, editor.selection.anchor, pathAbove);

        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ');
        }

        // select the tag text and insert the tag element
        Transforms.select(editor, targetRange);
        Transforms.insertText(editor, (item.data as BaseEmoji).native);
        // move the selection after the tag element
        Transforms.move(editor);

        // delete the inserted space
        if (isBlockEnd) {
          Transforms.delete(editor);
        }

        return closeMenu();
      }
    },
    [closeMenu, isOpen, targetRange]
  );
};
