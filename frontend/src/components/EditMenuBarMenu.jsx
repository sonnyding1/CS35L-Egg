import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useCallback, useEffect } from "react";

const EditMenuBarMenu = ({
  content,
  textareaRef,
  onContentChange,
  past,
  future,
  setPast,
  setFuture,
}) => {
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

  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const newFuture = [past[past.length - 1], ...future];
    const newPast = past.slice(0, past.length - 1);
    onContentChange(newPast[newPast.length - 1]);
    setPast(newPast);
    setFuture(newFuture);
  }, [past, future, setPast, setFuture, onContentChange]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const newPast = [...past, future[0]];
    const newFuture = future.slice(1);
    onContentChange(newPast[newPast.length - 1]);
    setPast(newPast);
    setFuture(newFuture);
  }, [past, future, setPast, setFuture, onContentChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.userAgent.includes("Macintosh");

      if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      if ((isMac ? e.metaKey : e.ctrlKey) && e.shiftKey && e.key === "z") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onSelect={() => handleUndo()}>
          Undo
          <MenubarShortcut>&#8984;Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleRedo()}>
          Redo
          <MenubarShortcut>&#8679;&#8984;Z</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleFormatting((text) => `**${text}**`)}>
          Bold
          <MenubarShortcut>&#8984;B</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleFormatting((text) => `*${text}*`)}>
          Italics
          <MenubarShortcut>&#8984;I</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleFormatting((text) => `\`${text}\``)}>
          Code
          <MenubarShortcut>&#8679;&#8984;C</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("> ")}>
          Blockquote
        </MenubarItem>
        <MenubarItem onSelect={() => handleFormatting((text) => `$${text}$`)}>
          Math
          <MenubarShortcut>&#8679;&#8984;M</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleLinePrefix("- ")}>
          Bullet Point
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("1. ")}>List</MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleLinePrefix("# ")}>
          Heading 1<MenubarShortcut>&#8679;&#8984;1</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("## ")}>
          Heading 2<MenubarShortcut>&#8679;&#8984;2</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("### ")}>
          Heading 3<MenubarShortcut>&#8679;&#8984;3</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default EditMenuBarMenu;
