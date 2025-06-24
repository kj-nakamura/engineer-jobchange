import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ScrollPosition {
  x: number;
  y: number;
}

class ScrollHistory {
  private static instance: ScrollHistory;
  private positions: Map<string, ScrollPosition> = new Map();

  static getInstance(): ScrollHistory {
    if (!ScrollHistory.instance) {
      ScrollHistory.instance = new ScrollHistory();
    }
    return ScrollHistory.instance;
  }

  savePosition(key: string, position: ScrollPosition): void {
    this.positions.set(key, position);
  }

  getPosition(key: string): ScrollPosition | undefined {
    return this.positions.get(key);
  }

  removePosition(key: string): void {
    this.positions.delete(key);
  }

  clear(): void {
    this.positions.clear();
  }
}

export const useScrollRestoration = () => {
  const router = useRouter();
  const scrollHistory = ScrollHistory.getInstance();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const saveScrollPosition = () => {
      const position = {
        x: window.scrollX,
        y: window.scrollY,
      };
      scrollHistory.savePosition(router.asPath, position);
    };

    const restoreScrollPosition = () => {
      const savedPosition = scrollHistory.getPosition(router.asPath);
      if (savedPosition) {
        // 少し遅延を入れてコンテンツが完全に読み込まれてからスクロール
        timeoutId = setTimeout(() => {
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto', // 即座にスクロール
          });
        }, 100);
      }
    };

    const handleRouteChangeStart = (url: string) => {
      // ページを離れる前にスクロール位置を保存
      saveScrollPosition();
    };

    const handleRouteChangeComplete = () => {
      // 新しいページが読み込まれた後にスクロール位置を復元
      restoreScrollPosition();
    };

    const handlePopState = () => {
      // ブラウザの戻る/進むボタンが押された時
      restoreScrollPosition();
    };

    // スクロールイベントを定期的に保存（ユーザーがスクロール中）
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(saveScrollPosition, 100);
    };

    // イベントリスナーを設定
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 初回読み込み時のスクロール位置復元
    restoreScrollPosition();

    // クリーンアップ
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [router.asPath, router.events, scrollHistory]);

  // 手動でスクロール位置をリセットする関数
  const resetScrollPosition = (path?: string) => {
    const targetPath = path || router.asPath;
    scrollHistory.removePosition(targetPath);
  };

  // 全てのスクロール位置をクリアする関数
  const clearAllScrollPositions = () => {
    scrollHistory.clear();
  };

  return {
    resetScrollPosition,
    clearAllScrollPositions,
  };
};