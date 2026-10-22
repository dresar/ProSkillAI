"use client";

import * as React from "react";

export function HtmlLangSetter({ locale }: { locale: string }) {
  React.useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
