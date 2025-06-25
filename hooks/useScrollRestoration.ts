import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ScrollPosition {
  x: number;
  y: number;
}

class ScrollHistory {
  private static instance: ScrollHistory;
  private positions: Map<string, ScrollPosition> = new Map();
  private readonly STORAGE_KEY = 'scroll-positions';

  static getInstance(): ScrollHistory {
    if (!ScrollHistory.instance) {
      ScrollHistory.instance = new ScrollHistory();
    }
    return ScrollHistory.instance;
  }

  constructor() {
    // ブラウザ環境でのみセッションストレージから復元
    if (typeof window !== 'undefined') {
      this.loadFromSessionStorage();
    }
  }

  private loadFromSessionStorage(): void {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, position]) => {
          this.positions.set(key, position as ScrollPosition);
        });
      }
    } catch (error) {
      console.warn('Failed to load scroll positions from sessionStorage:', error);
    }
  }

  private saveToSessionStorage(): void {
    try {
      const data: Record<string, ScrollPosition> = {};
      this.positions.forEach((position, key) => {
        data[key] = position;
      });
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save scroll positions to sessionStorage:', error);
    }
  }

  savePosition(key: string, position: ScrollPosition): void {
    this.positions.set(key, position);
    this.saveToSessionStorage();
  }

  getPosition(key: string): ScrollPosition | undefined {
    return this.positions.get(key);
  }

  removePosition(key: string): void {
    this.positions.delete(key);
    this.saveToSessionStorage();
  }

  clear(): void {
    this.positions.clear();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }
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
        // コンテンツの読み込み完了を待ってからスクロール復元
        const restore = () => {
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: 'auto', // 即座にスクロール
          });
        };

        // 画像やその他のリソースの読み込み完了を待つ
        if (document.readyState === 'complete') {
          timeoutId = setTimeout(restore, 50);
        } else {
          window.addEventListener('load', () => {
            timeoutId = setTimeout(restore, 100);
          }, { once: true });
        }
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

    // ページ離脱時（リロード、閉じる、別URL）にスクロール位置を保存
    const handleBeforeUnload = () => {
      saveScrollPosition();
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
    window.addEventListener('beforeunload', handleBeforeUnload);
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
      window.removeEventListener('beforeunload', handleBeforeUnload);
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