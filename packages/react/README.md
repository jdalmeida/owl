# @owl/react

Componentes React para coleta de feedback com highlight de UI.

## Uso

```tsx
import { FeedbackProvider, FeedbackWidget } from "@owl/react";

<FeedbackProvider apiUrl="/api/owl">
  <App />
  <FeedbackWidget position="bottom-right" />
</FeedbackProvider>
```

## Componentes

- `FeedbackProvider` - Context provider com apiUrl
- `FeedbackWidget` - Botão flutuante que ativa o modo feedback
- `FeedbackOverlay` - Overlay de seleção de elementos
- `CommentForm` - Formulário de comentário

## Hooks

- `useFeedback()` - Acesso ao contexto de feedback
- `useFeedbackContext()` - Contexto completo

## Funções

- `sendFeedback(input, options)` - Enviar feedback para a API (standalone)
