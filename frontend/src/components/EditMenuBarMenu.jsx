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
  const isMac = navigator.userAgent.includes("Macintosh");
  const modKeySymbol = isMac ? "&#8984;" : "Ctrl+";
  const altKeySymbol = isMac ? "&#8997;" : "Alt+";

  const handleFormatting = useCallback(
    (formatter) => {
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
    },
    [content, onContentChange, textareaRef],
  );

  const handleLinePrefix = useCallback(
    (prefix) => {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const startOfLine = value.lastIndexOf("\n", start - 1) + 1;
      const endOfLine = value.indexOf("\n", end);
      let currentLine = value.slice(
        startOfLine,
        endOfLine !== -1 ? endOfLine : value.length,
      );
      const oldLineLength = currentLine.length;

      // check if there is already a prefix
      const headingRegex = /^(#{1,5}\s|>\s|- \s|\d+\. )/;
      const match = currentLine.match(headingRegex);
      if (match) {
        currentLine = currentLine.replace(headingRegex, prefix);
      } else {
        currentLine = prefix + currentLine;
      }
      const newLineLength = currentLine.length;

      const newContent =
        value.slice(0, startOfLine) +
        currentLine +
        value.slice(endOfLine !== -1 ? endOfLine : value.length);
      onContentChange(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + newLineLength - oldLineLength,
          start + newLineLength - oldLineLength,
        );
      }, 1);
    },
    [onContentChange, textareaRef],
  );

  const handleUndo = useCallback(() => {
    if (past.length <= 1) return;
    const newFuture = [past[past.length - 1], ...future];
    const newPast = past.slice(0, past.length - 1);
    onContentChange(newPast[newPast.length - 1].content);
    setTimeout(() => {
      const textarea = textareaRef.current;
      textarea.focus();
      textarea.setSelectionRange(
        newPast[newPast.length - 1].cursorStart,
        newPast[newPast.length - 1].cursorEnd,
      );
    }, 1);
    setPast(newPast);
    setFuture(newFuture);
  }, [past, future, setPast, setFuture, onContentChange, textareaRef]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const newPast = [...past, future[0]];
    const newFuture = future.slice(1);
    onContentChange(newPast[newPast.length - 1].content);
    setTimeout(() => {
      const textarea = textareaRef.current;
      textarea.focus();
      textarea.setSelectionRange(
        newPast[newPast.length - 1].cursorStart,
        newPast[newPast.length - 1].cursorEnd,
      );
    }, 1);
    setPast(newPast);
    setFuture(newFuture);
  }, [past, future, setPast, setFuture, onContentChange, textareaRef]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.userAgent.includes("Macintosh");
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // console.log(`modKey: ${modKey}, altKey: ${e.altKey}, key: ${e.key}`);

      if (modKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      if (modKey && e.shiftKey && e.key === "z") {
        e.preventDefault();
        handleRedo();
      }

      if (modKey && e.key === "b") {
        e.preventDefault();
        handleFormatting((text) => `**${text}**`);
      }

      if (modKey && e.key === "i") {
        e.preventDefault();
        handleFormatting((text) => `*${text}*`);
      }

      if (modKey && e.shiftKey && e.key === "c") {
        e.preventDefault();
        handleFormatting((text) => `\`${text}\``);
      }

      if (modKey && e.shiftKey && e.key === "m") {
        e.preventDefault();
        handleFormatting((text) => `$${text}$`);
      }

      // code below use keycode because mac alt + other keys produce weird characters
      if (modKey && e.altKey && e.keyCode === 49) {
        e.preventDefault();
        handleLinePrefix("# ");
      }

      if (modKey && e.altKey && e.keyCode === 50) {
        e.preventDefault();
        handleLinePrefix("## ");
      }

      if (modKey && e.altKey && e.keyCode === 51) {
        e.preventDefault();
        handleLinePrefix("### ");
      }

      if (modKey && e.altKey && e.keyCode === 52) {
        e.preventDefault();
        handleLinePrefix("#### ");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleUndo, handleRedo, handleFormatting, handleLinePrefix]);

  return (
    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onSelect={() => handleUndo()}>
          Undo
          <MenubarShortcut
            dangerouslySetInnerHTML={{ __html: modKeySymbol + "Z" }}
          />
        </MenubarItem>
        <MenubarItem onSelect={() => handleRedo()}>
          Redo
          <MenubarShortcut
            dangerouslySetInnerHTML={{
              __html:
                (isMac ? "&#8679;" + modKeySymbol : modKeySymbol + "Shift+") +
                "Z",
            }}
          />
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleFormatting((text) => `**${text}**`)}>
          Bold
          <MenubarShortcut
            dangerouslySetInnerHTML={{ __html: modKeySymbol + "B" }}
          />
        </MenubarItem>
        <MenubarItem onSelect={() => handleFormatting((text) => `*${text}*`)}>
          Italics
          <MenubarShortcut
            dangerouslySetInnerHTML={{ __html: modKeySymbol + "I" }}
          />
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleFormatting((text) => `\`${text}\``)}>
          Code
          <MenubarShortcut
            dangerouslySetInnerHTML={{
              __html: isMac
                ? "&#8679;" + modKeySymbol + "C"
                : "Shift" + modKeySymbol + "C",
            }}
          />
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("> ")}>
          Blockquote
        </MenubarItem>
        <MenubarItem onSelect={() => handleFormatting((text) => `$${text}$`)}>
          Math
          <MenubarShortcut
            dangerouslySetInnerHTML={{
              __html: isMac
                ? "&#8679;" + modKeySymbol + "M"
                : "Shift" + modKeySymbol + "M",
            }}
          />
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleLinePrefix("- ")}>
          Bullet Point
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("1. ")}>List</MenubarItem>
        <MenubarSeparator />
        <MenubarItem onSelect={() => handleLinePrefix("# ")}>
          Heading 1
          <MenubarShortcut
            dangerouslySetInnerHTML={{
              __html: modKeySymbol + altKeySymbol + "1",
            }}
          />
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("## ")}>
          Heading 2
          <MenubarShortcut
            dangerouslySetInnerHTML={{
              __html: modKeySymbol + altKeySymbol + "2",
            }}
          />
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("### ")}>
          Heading 3
          <MenubarShortcut
            dangerouslySetInnerHTML={{
              __html: modKeySymbol + altKeySymbol + "3",
            }}
          />
        </MenubarItem>
        <MenubarItem onSelect={() => handleLinePrefix("#### ")}>
          Heading 4
          <MenubarShortcut
            dangerouslySetInnerHTML={{
              __html: modKeySymbol + altKeySymbol + "4",
            }}
          />
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default EditMenuBarMenu;
