import React from 'react';
import CloseOutlined from '@ant-design/icons/CloseOutlined';

import { DisabledContextProvider } from '../config-provider/DisabledContext';
import { useLocale } from '../locale';
import NormalCancelBtn from './components/NormalCancelBtn';
import NormalOkBtn from './components/NormalOkBtn';
import type { ModalContextProps } from './context';
import { ModalContextProvider } from './context';
import type { ModalProps } from './interface';
import { getConfirmLocale } from './locale';

export function renderCloseIcon(prefixCls: string, closeIcon?: React.ReactNode) {
  return (
    <span className={`${prefixCls}-close-x`}>
      {closeIcon || <CloseOutlined className={`${prefixCls}-close-icon`} />}
    </span>
  );
}

interface FooterProps {
  onOk?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const Footer: React.FC<
  FooterProps &
    Pick<
      ModalProps,
      | 'footer'
      | 'okText'
      | 'okType'
      | 'cancelText'
      | 'confirmLoading'
      | 'okButtonProps'
      | 'cancelButtonProps'
    >
> = (props) => {
  const {
    okText,
    okType = 'primary',
    cancelText,
    confirmLoading,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    footer,
  } = props;

  const [locale] = useLocale('Modal', getConfirmLocale());

  // ================== Locale Text ==================
  const okTextLocale = okText || locale?.okText;
  const cancelTextLocale = cancelText || locale?.cancelText;

  // ================= Context Value =================
  const btnCtxValue: ModalContextProps = {
    confirmLoading,
    okButtonProps,
    cancelButtonProps,
    okTextLocale,
    cancelTextLocale,
    okType,
    onOk,
    onCancel,
  };

  const btnCtxValueMemo = React.useMemo(() => btnCtxValue, [...Object.values(btnCtxValue)]);

  let footerNode;
  if (typeof footer === 'function' || typeof footer === 'undefined') {
    footerNode = (
      <ModalContextProvider value={btnCtxValueMemo}>
        <NormalCancelBtn />
        <NormalOkBtn />
      </ModalContextProvider>
    );
    if (typeof footer === 'function') {
      footerNode = footer(footerNode, {
        OkBtn: NormalOkBtn,
        CancelBtn: NormalCancelBtn,
      });
    }
  } else {
    footerNode = footer;
  }

  return <DisabledContextProvider disabled={false}>{footerNode}</DisabledContextProvider>;
};
