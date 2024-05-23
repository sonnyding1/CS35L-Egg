import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MenuSeparator } from "@headlessui/react";

const EditMenuBarMenu = ({ content, textareaRef, onContentChange }) => {
  const handleFormatting = (formatter) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);
    const formattedText = formatter(selectedText);
    const newContent = `${content.slice(0, start)}${formattedText}${content.slice(end)}`;
    onContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length,
      );
    }, 1);
  };

  const handleLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const startOfLine = value.lastIndexOf("\n", start - 1) + 1;
    const endOfLine = value.indexOf("\n", end);
    const currentLine = value.slice(
      startOfLine,
      endOfLine !== -1 ? endOfLine : value.length,
    );
    const newContent =
      value.slice(0, startOfLine) +
      prefix +
      currentLine +
      value.slice(endOfLine !== -1 ? endOfLine : value.length);
    onContentChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 1);
  };

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onSelect={() => handleFormatting((text) => `**${text}**`)}>
          Bold
          <MenubarShortcut>⌘B</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleFormatting((text) => `*${text}*`)}>
          Italics
          <MenubarShortcut>⌘I</MenubarShortcut>
        </MenubarItem>
        <MenuSeparator />
        <MenubarItem onSelect={() => handleFormatting((text) => `\`${text}\``)}>
          Code
          <MenubarShortcut>⇧⌘C</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("> ")}>
          Blockquote
        </MenubarItem>
        <MenubarItem onSelect={() => handleFormatting((text) => `$${text}$`)}>
          Math
          <MenubarShortcut>⇧⌘M</MenubarShortcut>
        </MenubarItem>
        <MenuSeparator />
        <MenubarItem onSelect={() => handleLinePrefix("- ")}>
          Bullet Point
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("1. ")}>List</MenubarItem>
        <MenuSeparator />
        <MenubarItem onSelect={() => handleLinePrefix("# ")}>
          Heading 1<MenubarShortcut>⌘H1</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("## ")}>
          Heading 2<MenubarShortcut>⌘H2</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("### ")}>
          Heading 3<MenubarShortcut>⌘H3</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default EditMenuBarMenu;
