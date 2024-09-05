/* empty css                                 */
import { c as createComponent, r as renderTemplate, a as addAttribute, e as renderHead, f as renderSlot, b as createAstro, g as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_BVHa2QHx.mjs';
import 'kleur/colors';
import { clsx } from 'clsx';
import { ref, computed, useSSRContext, defineComponent, mergeProps, withCtx, renderSlot as renderSlot$1, createVNode, onMounted, toDisplayString, openBlock, createBlock, withDirectives, vModelText, createCommentVNode, Fragment, renderList, createTextVNode, withAsyncContext, isVNode, resolveDynamicComponent } from 'vue';
import { createClient } from '@libsql/client';
import { cva } from 'class-variance-authority';
import { useForwardPropsEmits, DialogRoot, DialogTrigger, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogDescription, ToastRoot, ToastViewport as ToastViewport$1, ToastAction, ToastClose as ToastClose$1, ToastTitle as ToastTitle$1, ToastDescription as ToastDescription$1, ToastProvider as ToastProvider$1 } from 'radix-vue';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderStyle, ssrRenderVNode } from 'vue/server-renderer';
import { X } from 'lucide-vue-next';
import { twMerge } from 'tailwind-merge';
import { format } from '@formkit/tempo';
import { DrawerRoot, DrawerOverlay as DrawerOverlay$1, DrawerContent as DrawerContent$1, DrawerPortal, DrawerTitle as DrawerTitle$1, DrawerDescription as DrawerDescription$1, DrawerClose, DrawerTrigger } from 'vaul-vue';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "D:/xampp/htdocs/astro/questions/src/layouts/Layout.astro", void 0);

const client = createClient({
  url: "libsql://questions-jesuskor.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU0MjU2NDgsImlkIjoiYjQ4NjYzNzUtNTVlMC00YmJkLTgyZjEtY2NhOWMyMWNhMTk4In0.5tOVQrSfGgWIUsqUHTAkfS3d455F6OvXPxOyeAXVgmaWUW3zwMYlE8LwYHdGlGZsEhGXv6t9sbXAAqL2I_yiBQ"
});
const getQuestionsWithAnswerCount = async () => {
  const sql = `
    SELECT q.id, q.question, q.createdAt, COUNT(a.id) as answer_count
    FROM questions q
    LEFT JOIN answers a ON q.id = a.questionId
    GROUP BY q.id
    ORDER BY q.id DESC
  `;
  const result = await client.execute({ sql, args: [] });
  return result.rows;
};
const getAnswersForQuestion = async (questionId) => {
  const sql = `
    SELECT a.id, a.answer
    FROM answers a
    WHERE a.questionId = ?
  `;
  const result = await client.execute({ sql, args: [questionId] });
  return result.rows;
};
const addQuestion = async (question, date) => {
  const sql = `INSERT INTO questions (question, createdAt) VALUES (?, ?)`;
  const params = [question, date];
  await client.execute({ sql, args: params });
};
const addAnswerToQuestion = async (answer, questionId, date) => {
  const sql = `INSERT INTO answers (answer, questionId, createdAt) VALUES (?, ?, ?)`;
  const params = [answer, questionId, date];
  await client.execute({ sql, args: params });
};

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
function addToRemoveQueue(toastId) {
  if (toastTimeouts.has(toastId))
    return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
}
const state = ref({
  toasts: []
});
function dispatch(action) {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      state.value.toasts = [action.toast, ...state.value.toasts].slice(0, TOAST_LIMIT);
      break;
    case actionTypes.UPDATE_TOAST:
      state.value.toasts = state.value.toasts.map(
        (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
      );
      break;
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.value.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      state.value.toasts = state.value.toasts.map(
        (t) => t.id === toastId || toastId === void 0 ? {
          ...t,
          open: false
        } : t
      );
      break;
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === void 0)
        state.value.toasts = [];
      else
        state.value.toasts = state.value.toasts.filter((t) => t.id !== action.toastId);
      break;
  }
}
function useToast() {
  return {
    toasts: computed(() => state.value.toasts),
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
  };
}
function toast(props) {
  const id = genId();
  const update = (props2) => dispatch({
    type: actionTypes.UPDATE_TOAST,
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open)
          dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "Sheet",
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const __returned__ = { props, emits, forwarded, get DialogRoot() {
      return DialogRoot;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$n(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DialogRoot"], mergeProps($setup.forwarded, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/Sheet.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const Sheet = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["ssrRender", _sfc_ssrRender$n]]);

const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "SheetTrigger",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const __returned__ = { props, get DialogTrigger() {
      return DialogTrigger;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$m(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DialogTrigger"], mergeProps($setup.props, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/SheetTrigger.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const SheetTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["ssrRender", _sfc_ssrRender$m]]);

const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "SheetClose",
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const __returned__ = { props, get DialogClose() {
      return DialogClose;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/SheetClose.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const _sfc_main$m = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "SheetContent",
  props: {
    class: {},
    side: {},
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, side, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    const __returned__ = { props, emits, delegatedProps, forwarded, get DialogClose() {
      return DialogClose;
    }, get DialogContent() {
      return DialogContent;
    }, get DialogOverlay() {
      return DialogOverlay;
    }, get DialogPortal() {
      return DialogPortal;
    }, get X() {
      return X;
    }, get sheetVariants() {
      return sheetVariants;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$l(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DialogPortal"], _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent($setup["DialogOverlay"], { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent($setup["DialogContent"], mergeProps({
          class: $setup.cn($setup.sheetVariants({ side: $props.side }), $setup.props.class)
        }, { ...$setup.forwarded, ..._ctx.$attrs }), {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
              _push3(ssrRenderComponent($setup["DialogClose"], { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800" }, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent($setup["X"], { class: "w-4 h-4 text-neutral-500 dark:text-neutral-400" }, null, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode($setup["X"], { class: "w-4 h-4 text-neutral-500 dark:text-neutral-400" })
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                renderSlot$1(_ctx.$slots, "default"),
                createVNode($setup["DialogClose"], { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800" }, {
                  default: withCtx(() => [
                    createVNode($setup["X"], { class: "w-4 h-4 text-neutral-500 dark:text-neutral-400" })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode($setup["DialogOverlay"], { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
          createVNode($setup["DialogContent"], mergeProps({
            class: $setup.cn($setup.sheetVariants({ side: $props.side }), $setup.props.class)
          }, { ...$setup.forwarded, ..._ctx.$attrs }), {
            default: withCtx(() => [
              renderSlot$1(_ctx.$slots, "default"),
              createVNode($setup["DialogClose"], { class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800" }, {
                default: withCtx(() => [
                  createVNode($setup["X"], { class: "w-4 h-4 text-neutral-500 dark:text-neutral-400" })
                ]),
                _: 1
              })
            ]),
            _: 3
          }, 16, ["class"])
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/SheetContent.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const SheetContent = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender$l]]);

const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "SheetHeader",
  props: {
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const __returned__ = { props, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$k(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: $setup.cn("flex flex-col gap-y-2 text-center sm:text-left", $setup.props.class)
  }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/SheetHeader.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const SheetHeader = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["ssrRender", _sfc_ssrRender$k]]);

const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "SheetTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get DialogTitle() {
      return DialogTitle;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$j(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DialogTitle"], mergeProps({
    class: $setup.cn("text-lg font-semibold text-neutral-950 dark:text-neutral-50", $setup.props.class)
  }, $setup.delegatedProps, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/SheetTitle.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const SheetTitle = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["ssrRender", _sfc_ssrRender$j]]);

const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "SheetDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get DialogDescription() {
      return DialogDescription;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$i(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DialogDescription"], mergeProps({
    class: $setup.cn("text-sm text-neutral-500 dark:text-neutral-400", $setup.props.class)
  }, $setup.delegatedProps, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/SheetDescription.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const SheetDescription = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$i]]);

const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "SheetFooter",
  props: {
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const __returned__ = { props, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$h(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: $setup.cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
      $setup.props.class
    )
  }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/sheet/SheetFooter.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const SheetFooter = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$h]]);

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 dark:bg-neutral-950",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);

const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "CardQuestion",
  props: {
    data: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const { toast } = useToast();
    const { id, question, createdAt } = props.data;
    const answers = ref([]);
    onMounted(async () => {
      answers.value = await getAnswersForQuestion(id);
    });
    function formatDate(date) {
      const formatedDate = format(date, "MMMM D, YYYY. hh:mm a", "es");
      return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
    }
    function formatDateSmall(date) {
      const formatedDate = format(date, "D/M/YY. hh:mm a", "es");
      return formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
    }
    let show = ref(false);
    let answerText = ref("");
    function toggleShow() {
      show.value = !show.value;
      console.log(show.value);
    }
    async function addAnswer() {
      if (!answerText.value) {
        toast({
          title: "Campos vac\xEDos.",
          description: "Debes escribir una respuesta.",
          variant: "destructive"
        });
        return;
      }
      await addAnswerToQuestion(answerText.value, props.data.id, (/* @__PURE__ */ new Date()).toISOString());
      toast({
        description: "Respuesta enviada correctamente."
      });
      answers.value.push({
        answer: answerText.value,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      answerText.value = "";
      show.value = false;
    }
    const __returned__ = { props, toast, id, question, createdAt, answers, formatDate, formatDateSmall, get show() {
      return show;
    }, set show(v) {
      show = v;
    }, get answerText() {
      return answerText;
    }, set answerText(v) {
      answerText = v;
    }, toggleShow, addAnswer, get Sheet() {
      return Sheet;
    }, get SheetContent() {
      return SheetContent;
    }, get SheetDescription() {
      return SheetDescription;
    }, get SheetFooter() {
      return SheetFooter;
    }, get SheetHeader() {
      return SheetHeader;
    }, get SheetTitle() {
      return SheetTitle;
    }, get SheetTrigger() {
      return SheetTrigger;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$g(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["Sheet"], _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent($setup["SheetTrigger"], { "as-child": "" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
            } else {
              return [
                renderSlot$1(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent($setup["SheetContent"], { class: "flex flex-col justify-between" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent($setup["SheetHeader"], null, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent($setup["SheetDescription"], null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`<p class="text-slate-500"${_scopeId4}>${ssrInterpolate($setup.formatDate($setup.createdAt))}</p>`);
                        } else {
                          return [
                            createVNode("p", { class: "text-slate-500" }, toDisplayString($setup.formatDate($setup.createdAt)), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(ssrRenderComponent($setup["SheetTitle"], null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`<h2 class="text-2xl text-slate-600 text-left"${_scopeId4}>${ssrInterpolate($setup.question)}</h2>`);
                        } else {
                          return [
                            createVNode("h2", { class: "text-2xl text-slate-600 text-left" }, toDisplayString($setup.question), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode($setup["SheetDescription"], null, {
                        default: withCtx(() => [
                          createVNode("p", { class: "text-slate-500" }, toDisplayString($setup.formatDate($setup.createdAt)), 1)
                        ]),
                        _: 1
                      }),
                      createVNode($setup["SheetTitle"], null, {
                        default: withCtx(() => [
                          createVNode("h2", { class: "text-2xl text-slate-600 text-left" }, toDisplayString($setup.question), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(`<section class="my-4 h-full space-y-2 overflow-auto"${_scopeId2}>`);
              if ($setup.answers.length > 0) {
                _push3(`<!--[-->`);
                ssrRenderList($setup.answers, (answer, index) => {
                  _push3(`<div class="border border-slate-300 p-4 rounded-2xl"${_scopeId2}><p class="font-semibold text-slate-500 text-sm"${_scopeId2}>Anonimo#2834 - <time class="text-sm font-normal text-slate-400"${_scopeId2}>${ssrInterpolate($setup.formatDateSmall(answer.createdAt))}</time></p><p class="text-slate-500"${_scopeId2}>${ssrInterpolate(answer.answer)}</p></div>`);
                });
                _push3(`<!--]-->`);
              } else {
                _push3(`<div${_scopeId2}><p class="bg-slate-100 text-slate-500 p-2 text-center rounded-xl"${_scopeId2}>No hay respuestas</p></div>`);
              }
              _push3(`</section>`);
              _push3(ssrRenderComponent($setup["SheetFooter"], null, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    if ($setup.show) {
                      _push4(`<section class="my-4"${_scopeId3}><textarea class="w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg" placeholder="Escribe tu respuesta"${_scopeId3}>${ssrInterpolate($setup.answerText)}</textarea><button class="w-full bg-indigo-600 text-white p-4 rounded-2xl"${_scopeId3}> Enviar respuesta </button></section>`);
                    } else {
                      _push4(`<!---->`);
                    }
                    if (!$setup.show) {
                      _push4(`<button class="w-full bg-indigo-600 text-white p-4 rounded-2xl"${_scopeId3}> Agregar respuesta </button>`);
                    } else {
                      _push4(`<!---->`);
                    }
                  } else {
                    return [
                      $setup.show ? (openBlock(), createBlock("section", {
                        key: 0,
                        class: "my-4"
                      }, [
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => $setup.answerText = $event,
                          class: "w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg",
                          placeholder: "Escribe tu respuesta"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, $setup.answerText]
                        ]),
                        createVNode("button", {
                          onClick: $setup.addAnswer,
                          class: "w-full bg-indigo-600 text-white p-4 rounded-2xl"
                        }, " Enviar respuesta ")
                      ])) : createCommentVNode("", true),
                      !$setup.show ? (openBlock(), createBlock("button", {
                        key: 1,
                        onClick: $setup.toggleShow,
                        class: "w-full bg-indigo-600 text-white p-4 rounded-2xl"
                      }, " Agregar respuesta ")) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode($setup["SheetHeader"], null, {
                  default: withCtx(() => [
                    createVNode($setup["SheetDescription"], null, {
                      default: withCtx(() => [
                        createVNode("p", { class: "text-slate-500" }, toDisplayString($setup.formatDate($setup.createdAt)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode($setup["SheetTitle"], null, {
                      default: withCtx(() => [
                        createVNode("h2", { class: "text-2xl text-slate-600 text-left" }, toDisplayString($setup.question), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode("section", { class: "my-4 h-full space-y-2 overflow-auto" }, [
                  $setup.answers.length > 0 ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList($setup.answers, (answer, index) => {
                    return openBlock(), createBlock("div", {
                      key: index,
                      class: "border border-slate-300 p-4 rounded-2xl"
                    }, [
                      createVNode("p", { class: "font-semibold text-slate-500 text-sm" }, [
                        createTextVNode("Anonimo#2834 - "),
                        createVNode("time", { class: "text-sm font-normal text-slate-400" }, toDisplayString($setup.formatDateSmall(answer.createdAt)), 1)
                      ]),
                      createVNode("p", { class: "text-slate-500" }, toDisplayString(answer.answer), 1)
                    ]);
                  }), 128)) : (openBlock(), createBlock("div", { key: 1 }, [
                    createVNode("p", { class: "bg-slate-100 text-slate-500 p-2 text-center rounded-xl" }, "No hay respuestas")
                  ]))
                ]),
                createVNode($setup["SheetFooter"], null, {
                  default: withCtx(() => [
                    $setup.show ? (openBlock(), createBlock("section", {
                      key: 0,
                      class: "my-4"
                    }, [
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => $setup.answerText = $event,
                        class: "w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg",
                        placeholder: "Escribe tu respuesta"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, $setup.answerText]
                      ]),
                      createVNode("button", {
                        onClick: $setup.addAnswer,
                        class: "w-full bg-indigo-600 text-white p-4 rounded-2xl"
                      }, " Enviar respuesta ")
                    ])) : createCommentVNode("", true),
                    !$setup.show ? (openBlock(), createBlock("button", {
                      key: 1,
                      onClick: $setup.toggleShow,
                      class: "w-full bg-indigo-600 text-white p-4 rounded-2xl"
                    }, " Agregar respuesta ")) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode($setup["SheetTrigger"], { "as-child": "" }, {
            default: withCtx(() => [
              renderSlot$1(_ctx.$slots, "default")
            ]),
            _: 3
          }),
          createVNode($setup["SheetContent"], { class: "flex flex-col justify-between" }, {
            default: withCtx(() => [
              createVNode($setup["SheetHeader"], null, {
                default: withCtx(() => [
                  createVNode($setup["SheetDescription"], null, {
                    default: withCtx(() => [
                      createVNode("p", { class: "text-slate-500" }, toDisplayString($setup.formatDate($setup.createdAt)), 1)
                    ]),
                    _: 1
                  }),
                  createVNode($setup["SheetTitle"], null, {
                    default: withCtx(() => [
                      createVNode("h2", { class: "text-2xl text-slate-600 text-left" }, toDisplayString($setup.question), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode("section", { class: "my-4 h-full space-y-2 overflow-auto" }, [
                $setup.answers.length > 0 ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList($setup.answers, (answer, index) => {
                  return openBlock(), createBlock("div", {
                    key: index,
                    class: "border border-slate-300 p-4 rounded-2xl"
                  }, [
                    createVNode("p", { class: "font-semibold text-slate-500 text-sm" }, [
                      createTextVNode("Anonimo#2834 - "),
                      createVNode("time", { class: "text-sm font-normal text-slate-400" }, toDisplayString($setup.formatDateSmall(answer.createdAt)), 1)
                    ]),
                    createVNode("p", { class: "text-slate-500" }, toDisplayString(answer.answer), 1)
                  ]);
                }), 128)) : (openBlock(), createBlock("div", { key: 1 }, [
                  createVNode("p", { class: "bg-slate-100 text-slate-500 p-2 text-center rounded-xl" }, "No hay respuestas")
                ]))
              ]),
              createVNode($setup["SheetFooter"], null, {
                default: withCtx(() => [
                  $setup.show ? (openBlock(), createBlock("section", {
                    key: 0,
                    class: "my-4"
                  }, [
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => $setup.answerText = $event,
                      class: "w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg",
                      placeholder: "Escribe tu respuesta"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, $setup.answerText]
                    ]),
                    createVNode("button", {
                      onClick: $setup.addAnswer,
                      class: "w-full bg-indigo-600 text-white p-4 rounded-2xl"
                    }, " Enviar respuesta ")
                  ])) : createCommentVNode("", true),
                  !$setup.show ? (openBlock(), createBlock("button", {
                    key: 1,
                    onClick: $setup.toggleShow,
                    class: "w-full bg-indigo-600 text-white p-4 rounded-2xl"
                  }, " Agregar respuesta ")) : createCommentVNode("", true)
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/CardQuestion.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const CardQuestion = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$g]]);

const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "Drawer",
  props: {
    activeSnapPoint: {},
    closeThreshold: {},
    shouldScaleBackground: { type: Boolean, default: true },
    scrollLockTimeout: {},
    fixed: { type: Boolean },
    dismissible: { type: Boolean },
    modal: { type: Boolean },
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    nested: { type: Boolean },
    direction: {},
    snapPoints: {},
    fadeFromIndex: {}
  },
  emits: ["drag", "release", "close", "update:open", "update:activeSnapPoint"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const __returned__ = { props, emits, forwarded, get DrawerRoot() {
      return DrawerRoot;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$f(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DrawerRoot"], mergeProps($setup.forwarded, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/drawer/Drawer.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const Drawer = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$f]]);

const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "DrawerOverlay",
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get DrawerOverlay() {
      return DrawerOverlay$1;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DrawerOverlay"], mergeProps($setup.delegatedProps, {
    class: $setup.cn("fixed inset-0 z-50 bg-black/80", $setup.props.class)
  }, _attrs), null, _parent));
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/drawer/DrawerOverlay.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const DrawerOverlay = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$e]]);

const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "DrawerContent",
  props: {
    forceMount: { type: Boolean },
    trapFocus: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    const __returned__ = { props, emits, forwarded, get DrawerContent() {
      return DrawerContent$1;
    }, get DrawerPortal() {
      return DrawerPortal;
    }, DrawerOverlay, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DrawerPortal"], _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent($setup["DrawerOverlay"], null, null, _parent2, _scopeId));
        _push2(ssrRenderComponent($setup["DrawerContent"], mergeProps($setup.forwarded, {
          class: $setup.cn(
            "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
            $setup.props.class
          )
        }), {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<div class="mx-auto mt-4 h-2 w-[100px] rounded-full bg-neutral-100 dark:bg-neutral-800"${_scopeId2}></div>`);
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
            } else {
              return [
                createVNode("div", { class: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-neutral-100 dark:bg-neutral-800" }),
                renderSlot$1(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode($setup["DrawerOverlay"]),
          createVNode($setup["DrawerContent"], mergeProps($setup.forwarded, {
            class: $setup.cn(
              "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
              $setup.props.class
            )
          }), {
            default: withCtx(() => [
              createVNode("div", { class: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-neutral-100 dark:bg-neutral-800" }),
              renderSlot$1(_ctx.$slots, "default")
            ]),
            _: 3
          }, 16, ["class"])
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/drawer/DrawerContent.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const DrawerContent = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$d]]);

const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "DrawerHeader",
  props: {
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const __returned__ = { props, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: $setup.cn("grid gap-1.5 p-4 text-center sm:text-left", $setup.props.class)
  }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/drawer/DrawerHeader.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const DrawerHeader = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$c]]);

const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "DrawerFooter",
  props: {
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const __returned__ = { props, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: $setup.cn("mt-auto flex flex-col gap-2 p-4", $setup.props.class)
  }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/drawer/DrawerFooter.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const DrawerFooter = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$b]]);

const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "DrawerTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get DrawerTitle() {
      return DrawerTitle$1;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DrawerTitle"], mergeProps($setup.delegatedProps, {
    class: $setup.cn("text-lg font-semibold leading-none tracking-tight", $setup.props.class)
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/drawer/DrawerTitle.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const DrawerTitle = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$a]]);

const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "DrawerDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get DrawerDescription() {
      return DrawerDescription$1;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["DrawerDescription"], mergeProps($setup.delegatedProps, {
    class: $setup.cn("text-sm text-neutral-500 dark:text-neutral-400", $setup.props.class)
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/drawer/DrawerDescription.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const DrawerDescription = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender$9]]);

const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "ButtonQuestion",
  setup(__props, { expose: __expose }) {
    __expose();
    const { toast } = useToast();
    const questionText = ref("");
    const handleSubmit = () => {
      if (!questionText.value) {
        toast({
          title: "Campos vac\xEDos.",
          description: "Debes escribir una pregunta.",
          variant: "destructive"
        });
        return;
      }
      addQuestion(questionText.value, (/* @__PURE__ */ new Date()).toISOString());
      questionText.value = "";
      toast({
        description: "Respuesta enviada correctamente."
      });
      setTimeout(() => {
        location.reload();
      }, 500);
    };
    const __returned__ = { toast, questionText, handleSubmit, get Drawer() {
      return Drawer;
    }, get DrawerClose() {
      return DrawerClose;
    }, get DrawerContent() {
      return DrawerContent;
    }, get DrawerDescription() {
      return DrawerDescription;
    }, get DrawerFooter() {
      return DrawerFooter;
    }, get DrawerHeader() {
      return DrawerHeader;
    }, get DrawerTitle() {
      return DrawerTitle;
    }, get DrawerTrigger() {
      return DrawerTrigger;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["Drawer"], _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent($setup["DrawerTrigger"], null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`<button class="w-full md:w-auto mb-14 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full bg-indigo-600 shadow-xs hover:bg-indigo-700 transition-all duration-500"${_scopeId2}> \xA1Haz una pregunta! <svg class="ml-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"${_scopeId2}><path d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${_scopeId2}></path></svg></button>`);
            } else {
              return [
                createVNode("button", { class: "w-full md:w-auto mb-14 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full bg-indigo-600 shadow-xs hover:bg-indigo-700 transition-all duration-500" }, [
                  createTextVNode(" \xA1Haz una pregunta! "),
                  (openBlock(), createBlock("svg", {
                    class: "ml-2",
                    width: "20",
                    height: "20",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                  }, [
                    createVNode("path", {
                      d: "M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5",
                      stroke: "white",
                      "stroke-width": "2",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    })
                  ]))
                ])
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent($setup["DrawerContent"], null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent($setup["DrawerHeader"], null, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(ssrRenderComponent($setup["DrawerTitle"], null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`<p class="text-neutral-700"${_scopeId4}>Escribe tu pregunta</p>`);
                        } else {
                          return [
                            createVNode("p", { class: "text-neutral-700" }, "Escribe tu pregunta")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(ssrRenderComponent($setup["DrawerDescription"], null, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`<textarea class="w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Escribe tu pregunta"${_scopeId4}>${ssrInterpolate($setup.questionText)}</textarea>`);
                        } else {
                          return [
                            withDirectives(createVNode("textarea", {
                              "onUpdate:modelValue": ($event) => $setup.questionText = $event,
                              class: "w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                              placeholder: "Escribe tu pregunta"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, $setup.questionText]
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                  } else {
                    return [
                      createVNode($setup["DrawerTitle"], null, {
                        default: withCtx(() => [
                          createVNode("p", { class: "text-neutral-700" }, "Escribe tu pregunta")
                        ]),
                        _: 1
                      }),
                      createVNode($setup["DrawerDescription"], null, {
                        default: withCtx(() => [
                          withDirectives(createVNode("textarea", {
                            "onUpdate:modelValue": ($event) => $setup.questionText = $event,
                            class: "w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                            placeholder: "Escribe tu pregunta"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, $setup.questionText]
                          ])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
              _push3(ssrRenderComponent($setup["DrawerFooter"], null, {
                default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                  if (_push4) {
                    _push4(`<div class="flex items-center justify-center gap-4"${_scopeId3}><button class="bg-indigo-600 w-full px-4 py-2 rounded-2xl text-white"${_scopeId3}>Enviar</button>`);
                    _push4(ssrRenderComponent($setup["DrawerClose"], { class: "w-full" }, {
                      default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                        if (_push5) {
                          _push5(`<button class="border text-indigo-600 border-indigo-600 w-full px-4 py-2 rounded-2xl"${_scopeId4}>Cerrar</button>`);
                        } else {
                          return [
                            createVNode("button", { class: "border text-indigo-600 border-indigo-600 w-full px-4 py-2 rounded-2xl" }, "Cerrar")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent4, _scopeId3));
                    _push4(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex items-center justify-center gap-4" }, [
                        createVNode("button", {
                          onClick: $setup.handleSubmit,
                          class: "bg-indigo-600 w-full px-4 py-2 rounded-2xl text-white"
                        }, "Enviar"),
                        createVNode($setup["DrawerClose"], { class: "w-full" }, {
                          default: withCtx(() => [
                            createVNode("button", { class: "border text-indigo-600 border-indigo-600 w-full px-4 py-2 rounded-2xl" }, "Cerrar")
                          ]),
                          _: 1
                        })
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent3, _scopeId2));
            } else {
              return [
                createVNode($setup["DrawerHeader"], null, {
                  default: withCtx(() => [
                    createVNode($setup["DrawerTitle"], null, {
                      default: withCtx(() => [
                        createVNode("p", { class: "text-neutral-700" }, "Escribe tu pregunta")
                      ]),
                      _: 1
                    }),
                    createVNode($setup["DrawerDescription"], null, {
                      default: withCtx(() => [
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => $setup.questionText = $event,
                          class: "w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                          placeholder: "Escribe tu pregunta"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, $setup.questionText]
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode($setup["DrawerFooter"], null, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex items-center justify-center gap-4" }, [
                      createVNode("button", {
                        onClick: $setup.handleSubmit,
                        class: "bg-indigo-600 w-full px-4 py-2 rounded-2xl text-white"
                      }, "Enviar"),
                      createVNode($setup["DrawerClose"], { class: "w-full" }, {
                        default: withCtx(() => [
                          createVNode("button", { class: "border text-indigo-600 border-indigo-600 w-full px-4 py-2 rounded-2xl" }, "Cerrar")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode($setup["DrawerTrigger"], null, {
            default: withCtx(() => [
              createVNode("button", { class: "w-full md:w-auto mb-14 inline-flex items-center justify-center py-3 px-7 text-base font-semibold text-center text-white rounded-full bg-indigo-600 shadow-xs hover:bg-indigo-700 transition-all duration-500" }, [
                createTextVNode(" \xA1Haz una pregunta! "),
                (openBlock(), createBlock("svg", {
                  class: "ml-2",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 20 20",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  createVNode("path", {
                    d: "M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5",
                    stroke: "white",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ]))
              ])
            ]),
            _: 1
          }),
          createVNode($setup["DrawerContent"], null, {
            default: withCtx(() => [
              createVNode($setup["DrawerHeader"], null, {
                default: withCtx(() => [
                  createVNode($setup["DrawerTitle"], null, {
                    default: withCtx(() => [
                      createVNode("p", { class: "text-neutral-700" }, "Escribe tu pregunta")
                    ]),
                    _: 1
                  }),
                  createVNode($setup["DrawerDescription"], null, {
                    default: withCtx(() => [
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => $setup.questionText = $event,
                        class: "w-full h-32 p-4 mt-4 text-sm text-gray-600 placeholder-gray-400 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
                        placeholder: "Escribe tu pregunta"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, $setup.questionText]
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode($setup["DrawerFooter"], null, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex items-center justify-center gap-4" }, [
                    createVNode("button", {
                      onClick: $setup.handleSubmit,
                      class: "bg-indigo-600 w-full px-4 py-2 rounded-2xl text-white"
                    }, "Enviar"),
                    createVNode($setup["DrawerClose"], { class: "w-full" }, {
                      default: withCtx(() => [
                        createVNode("button", { class: "border text-indigo-600 border-indigo-600 w-full px-4 py-2 rounded-2xl" }, "Cerrar")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ButtonQuestion.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const ButtonQuestion = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["ssrRender", _sfc_ssrRender$8]]);

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Questions",
  async setup(__props, { expose: __expose }) {
    __expose();
    let __temp, __restore;
    const questions = ([__temp, __restore] = withAsyncContext(() => getQuestionsWithAnswerCount()), __temp = await __temp, __restore(), __temp);
    const questions2 = [];
    console.log(questions);
    const __returned__ = { questions, questions2, CardQuestion, ButtonQuestion };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full flex flex-col items-center gap-y-3" }, _attrs))}>`);
  _push(ssrRenderComponent($setup["ButtonQuestion"], null, null, _parent));
  if ($setup.questions.length > 0) {
    _push(`<!--[-->`);
    ssrRenderList($setup.questions, (question) => {
      _push(`<div class="w-full flex flex-col items-center">`);
      _push(ssrRenderComponent($setup["CardQuestion"], { data: question }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow shadow-slate-200/50 hover:shadow-slate-200 p-4 rounded-xl w-full max-w-2xl flex items-center justify-between gap-x-4"${_scopeId}><p class="text-lg font-semibold text-slate-600 text-left line-clamp-1"${_scopeId}>${ssrInterpolate(question.question)}</p><section class="flex items-center gap-2 text-slate-400"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256"${_scopeId}><g fill="currentColor" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="${ssrRenderStyle({ "mix-blend-mode": "normal" })}"${_scopeId}><g transform="scale(10.66667,10.66667)"${_scopeId}><path d="M12,2c-5.523,0 -10,4.477 -10,10c0,1.592 0.382,3.091 1.043,4.427l-1.005,4.019c-0.229,0.915 0.6,1.745 1.516,1.516l4.019,-1.005c1.336,0.661 2.835,1.043 4.427,1.043c5.523,0 10,-4.477 10,-10c0,-5.523 -4.477,-10 -10,-10z" opacity="0.35"${_scopeId}></path><path d="M15,11h-6c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h6c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z"${_scopeId}></path><path d="M13,15h-4c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h4c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z"${_scopeId}></path></g></g></svg><span class="font-semibold"${_scopeId}>${ssrInterpolate(question.answer_count)}</span></section></div>`);
          } else {
            return [
              createVNode("div", { class: "cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow shadow-slate-200/50 hover:shadow-slate-200 p-4 rounded-xl w-full max-w-2xl flex items-center justify-between gap-x-4" }, [
                createVNode("p", { class: "text-lg font-semibold text-slate-600 text-left line-clamp-1" }, toDisplayString(question.question), 1),
                createVNode("section", { class: "flex items-center gap-2 text-slate-400" }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    x: "0px",
                    y: "0px",
                    width: "20",
                    height: "20",
                    viewBox: "0,0,256,256"
                  }, [
                    createVNode("g", {
                      fill: "currentColor",
                      "fill-rule": "nonzero",
                      stroke: "none",
                      "stroke-width": "1",
                      "stroke-linecap": "butt",
                      "stroke-linejoin": "miter",
                      "stroke-miterlimit": "10",
                      "stroke-dasharray": "",
                      "stroke-dashoffset": "0",
                      "font-family": "none",
                      "font-weight": "none",
                      "font-size": "none",
                      "text-anchor": "none",
                      style: { "mix-blend-mode": "normal" }
                    }, [
                      createVNode("g", { transform: "scale(10.66667,10.66667)" }, [
                        createVNode("path", {
                          d: "M12,2c-5.523,0 -10,4.477 -10,10c0,1.592 0.382,3.091 1.043,4.427l-1.005,4.019c-0.229,0.915 0.6,1.745 1.516,1.516l4.019,-1.005c1.336,0.661 2.835,1.043 4.427,1.043c5.523,0 10,-4.477 10,-10c0,-5.523 -4.477,-10 -10,-10z",
                          opacity: "0.35"
                        }),
                        createVNode("path", { d: "M15,11h-6c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h6c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z" }),
                        createVNode("path", { d: "M13,15h-4c-0.553,0 -1,-0.448 -1,-1c0,-0.552 0.447,-1 1,-1h4c0.553,0 1,0.448 1,1c0,0.552 -0.447,1 -1,1z" })
                      ])
                    ])
                  ])),
                  createVNode("span", { class: "font-semibold" }, toDisplayString(question.answer_count), 1)
                ])
              ])
            ];
          }
        }),
        _: 2
      }, _parent));
      _push(`</div>`);
    });
    _push(`<!--]-->`);
  } else {
    _push(`<div><p>No hay preguntas</p></div>`);
  }
  _push(`</div>`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/Questions.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const Questions = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender$7]]);

const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Toast",
  props: {
    class: {},
    variant: {},
    onOpenChange: { type: Function },
    defaultOpen: { type: Boolean },
    forceMount: { type: Boolean },
    type: {},
    open: { type: Boolean },
    duration: {},
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pause", "resume", "swipeStart", "swipeMove", "swipeCancel", "swipeEnd", "update:open"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    const __returned__ = { props, emits, delegatedProps, forwarded, get ToastRoot() {
      return ToastRoot;
    }, get toastVariants() {
      return toastVariants;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["ToastRoot"], mergeProps($setup.forwarded, {
    class: $setup.cn($setup.toastVariants({ variant: $props.variant }), $setup.props.class),
    "onUpdate:open": $props.onOpenChange
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/Toast.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Toast = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$6]]);

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ToastViewport",
  props: {
    hotkey: {},
    label: { type: [String, Function] },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get ToastViewport() {
      return ToastViewport$1;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["ToastViewport"], mergeProps($setup.delegatedProps, {
    class: $setup.cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", $setup.props.class)
  }, _attrs), null, _parent));
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/ToastViewport.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ToastViewport = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$5]]);

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ToastAction",
  props: {
    altText: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get ToastAction() {
      return ToastAction;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/ToastAction.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ToastClose",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get ToastClose() {
      return ToastClose$1;
    }, get X() {
      return X;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["ToastClose"], mergeProps($setup.delegatedProps, {
    class: $setup.cn("absolute right-2 top-2 rounded-md p-1 text-neutral-950/50 opacity-0 transition-opacity hover:text-neutral-950 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:text-neutral-50/50 dark:hover:text-neutral-50", $setup.props.class)
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent($setup["X"], { class: "h-4 w-4" }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode($setup["X"], { class: "h-4 w-4" })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/ToastClose.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ToastClose = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ToastTitle",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get ToastTitle() {
      return ToastTitle$1;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["ToastTitle"], mergeProps($setup.delegatedProps, {
    class: $setup.cn("text-sm font-semibold", $setup.props.class)
  }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/ToastTitle.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ToastTitle = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ToastDescription",
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const __returned__ = { props, delegatedProps, get ToastDescription() {
      return ToastDescription$1;
    }, get cn() {
      return cn;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["ToastDescription"], mergeProps({
    class: $setup.cn("text-sm opacity-90", $setup.props.class)
  }, $setup.delegatedProps, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/ToastDescription.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ToastDescription = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ToastProvider",
  props: {
    label: {},
    duration: {},
    swipeDirection: {},
    swipeThreshold: {}
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const __returned__ = { props, get ToastProvider() {
      return ToastProvider$1;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["ToastProvider"], mergeProps($setup.props, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
      } else {
        return [
          renderSlot$1(_ctx.$slots, "default")
        ];
      }
    }),
    _: 3
  }, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/ToastProvider.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ToastProvider = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-neutral-200 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[--radix-toast-swipe-end-x] data-[swipe=move]:translate-x-[--radix-toast-swipe-move-x] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-neutral-800",
  {
    variants: {
      variant: {
        default: "border bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50",
        destructive: "destructive group border-red-500 bg-red-500 text-neutral-50 dark:border-red-900 dark:bg-red-900 dark:text-neutral-50"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Toaster",
  setup(__props, { expose: __expose }) {
    __expose();
    const { toasts } = useToast();
    const __returned__ = { toasts, isVNode, get Toast() {
      return Toast;
    }, get ToastClose() {
      return ToastClose;
    }, get ToastDescription() {
      return ToastDescription;
    }, get ToastProvider() {
      return ToastProvider;
    }, get ToastTitle() {
      return ToastTitle;
    }, get ToastViewport() {
      return ToastViewport;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(ssrRenderComponent($setup["ToastProvider"], _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<!--[-->`);
        ssrRenderList($setup.toasts, (toast) => {
          _push2(ssrRenderComponent($setup["Toast"], mergeProps({
            key: toast.id,
            ref_for: true
          }, toast), {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<div class="grid gap-1"${_scopeId2}>`);
                if (toast.title) {
                  _push3(ssrRenderComponent($setup["ToastTitle"], null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(toast.title)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(toast.title), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  _push3(`<!---->`);
                }
                if (toast.description) {
                  _push3(`<!--[-->`);
                  if ($setup.isVNode(toast.description)) {
                    _push3(ssrRenderComponent($setup["ToastDescription"], null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(toast.description), null, null), _parent4, _scopeId3);
                        } else {
                          return [
                            (openBlock(), createBlock(resolveDynamicComponent(toast.description)))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent($setup["ToastDescription"], null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(toast.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(toast.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  }
                  _push3(`<!--]-->`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(ssrRenderComponent($setup["ToastClose"], null, null, _parent3, _scopeId2));
                _push3(`</div>`);
                ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(toast.action), null, null), _parent3, _scopeId2);
              } else {
                return [
                  createVNode("div", { class: "grid gap-1" }, [
                    toast.title ? (openBlock(), createBlock($setup["ToastTitle"], { key: 0 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(toast.title), 1)
                      ]),
                      _: 2
                    }, 1024)) : createCommentVNode("", true),
                    toast.description ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                      $setup.isVNode(toast.description) ? (openBlock(), createBlock($setup["ToastDescription"], { key: 0 }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(toast.description)))
                        ]),
                        _: 2
                      }, 1024)) : (openBlock(), createBlock($setup["ToastDescription"], { key: 1 }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(toast.description), 1)
                        ]),
                        _: 2
                      }, 1024))
                    ], 64)) : createCommentVNode("", true),
                    createVNode($setup["ToastClose"])
                  ]),
                  (openBlock(), createBlock(resolveDynamicComponent(toast.action)))
                ];
              }
            }),
            _: 2
          }, _parent2, _scopeId));
        });
        _push2(`<!--]-->`);
        _push2(ssrRenderComponent($setup["ToastViewport"], null, null, _parent2, _scopeId));
      } else {
        return [
          (openBlock(true), createBlock(Fragment, null, renderList($setup.toasts, (toast) => {
            return openBlock(), createBlock($setup["Toast"], mergeProps({
              key: toast.id,
              ref_for: true
            }, toast), {
              default: withCtx(() => [
                createVNode("div", { class: "grid gap-1" }, [
                  toast.title ? (openBlock(), createBlock($setup["ToastTitle"], { key: 0 }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(toast.title), 1)
                    ]),
                    _: 2
                  }, 1024)) : createCommentVNode("", true),
                  toast.description ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    $setup.isVNode(toast.description) ? (openBlock(), createBlock($setup["ToastDescription"], { key: 0 }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(resolveDynamicComponent(toast.description)))
                      ]),
                      _: 2
                    }, 1024)) : (openBlock(), createBlock($setup["ToastDescription"], { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(toast.description), 1)
                      ]),
                      _: 2
                    }, 1024))
                  ], 64)) : createCommentVNode("", true),
                  createVNode($setup["ToastClose"])
                ]),
                (openBlock(), createBlock(resolveDynamicComponent(toast.action)))
              ]),
              _: 2
            }, 1040);
          }), 128)),
          createVNode($setup["ToastViewport"])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/ui/toast/Toaster.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Toaster = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Astro." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Toaster", Toaster, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/ui/toast/Toaster.vue", "client:component-export": "default" })} ${maybeRenderHead()}<main> <section class="py-8 lg:py-32 bg-[url('https://pagedone.io/asset/uploads/1691055810.png')] bg-center bg-cover bg-fixed"> <div class="mx-auto max-w-7xl min-h-svh px-4 sm:px-6 lg:px-8 relative text-center"> <h1 class="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 mb-5 md:text-5xl leading-[50px]">
Envía tu pregunta de forma
<span class="text-indigo-600">anónima</span> </h1> <p class="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">Haz clic en una pregunta para ver la respuesta</p> <section class="flex flex-col items-center gap-y-3"> ${renderComponent($$result2, "Questions", Questions, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Questions.vue", "client:component-export": "default" })} </section> </div> </section> </main> ` })}`;
}, "D:/xampp/htdocs/astro/questions/src/pages/index.astro", void 0);

const $$file = "D:/xampp/htdocs/astro/questions/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
