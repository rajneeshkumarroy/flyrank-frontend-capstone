# Week 4 Accessibility Component Comparison

## Overview

For this assignment, I first built a modal dialog, tabs, and disclosure component manually using React and TypeScript without a component library. I then installed shadcn/ui and added its Dialog and Tabs components to compare the implementation and accessibility behavior.

The shadcn components in this project use Base UI primitives underneath, so much of the accessibility behavior is provided by `@base-ui/react/dialog` and `@base-ui/react/tabs`.

## Modal Dialog Comparison

My hand-built modal implements the basic dialog pattern manually. It uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape-to-close behavior, focus trapping with Tab and Shift+Tab, and restoration of focus to the element that opened the dialog.

The shadcn/Base UI implementation delegates dialog behavior to `@base-ui/react/dialog`. The generated component provides reusable primitives such as `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogTitle`, and `DialogDescription`.

One concrete gap in my implementation is that my modal uses a hard-coded `modal-title` ID. Multiple modal instances could therefore create duplicate IDs. The shadcn implementation provides dedicated title and description primitives that integrate with the underlying dialog primitive.

Another gap is that my modal does not provide a dedicated `aria-describedby` relationship for dialog descriptions. The shadcn implementation exposes `DialogDescription` for this purpose.

The shadcn implementation also uses a portal for the dialog content. My implementation renders the modal directly where the component is placed, so it does not have the same portal-based separation from the surrounding layout.

## Tabs Comparison

My hand-built tabs implement `role="tablist"`, `role="tab"`, and `role="tabpanel"`. I also implemented ArrowLeft, ArrowRight, Home, and End keyboard navigation and use `aria-selected`, `aria-controls`, and `aria-labelledby` to connect the tabs with their panels.

The shadcn implementation delegates the behavior to `@base-ui/react/tabs`. It provides reusable primitives such as `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent`.

A concrete gap in my implementation is that I manually manage keyboard navigation and focus with event handlers and DOM queries. This means I am responsible for maintaining that accessibility behavior myself. The Base UI primitive used by shadcn handles this behavior as part of the reusable Tabs primitive.

Another gap is that my implementation has fewer configuration and state-handling capabilities. My tabs do not implement disabled tabs or vertical orientation, while the underlying Base UI tabs primitive supports additional behavior such as orientation and disabled states.

## Disclosure Comparison

The disclosure was implemented manually using a native HTML button. The button uses `aria-expanded` and `aria-controls`, while the content is conditionally rendered.

Using a real button means that Enter, Space, and Tab keyboard behavior are provided by the browser instead of having to recreate those interactions with custom keyboard event handlers.

This component was not replaced with a shadcn component because the assignment specifically requires adding and comparing shadcn Dialog and Tabs.

## Main Lessons

The biggest lesson from this exercise is that accessible components require more than adding ARIA attributes. Focus management, keyboard interaction, unique IDs, relationships between controls and content, and reusable behavior all need to be considered.

Building the components manually helped me understand the accessibility behavior before using a component system. Comparing them with shadcn showed me that the value of an accessible component library is not only styling. The underlying primitives provide reusable interaction and accessibility behavior that would otherwise have to be maintained manually.

I also learned that native HTML elements should be preferred when they already provide the required keyboard behavior. The disclosure uses a real button instead of recreating button keyboard interaction with custom event handlers.
