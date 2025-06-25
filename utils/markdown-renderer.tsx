import React from 'react';
import { marked } from 'marked';
import AffiliateButton from '../components/AffiliateButton';
import ServiceCTA from '../components/ServiceCTA';

// カスタムレンダラーでアフィリエイトコンポーネントをサポート
export interface ComponentData {
  services?: any[];
  articleId?: string;
  articleCategory?: string;
}

// マークダウン内のカスタムコンポーネント記法を処理
export function processMarkdownComponents(markdown: string, data: ComponentData = {}) {
  const { services = [], articleId, articleCategory } = data;
  
  // AffiliateButton コンポーネントの記法: [affiliate-button:service-name:text:variant]
  const affiliateButtonRegex = /\[affiliate-button:([^:]+):([^:]+)(?::([^:]+))?\]/g;
  
  // ServiceCTA コンポーネントの記法: [service-cta:service-name:variant]
  const serviceCTARegex = /\[service-cta:([^:]+)(?::([^:]+))?\]/g;
  
  let processedMarkdown = markdown;
  
  // AffiliateButton の処理
  processedMarkdown = processedMarkdown.replace(affiliateButtonRegex, (match, serviceName, text, variant = 'primary') => {
    const service = services.find(s => s.name.toLowerCase() === serviceName.toLowerCase() || s.id === serviceName);
    if (!service) {
      return `[Error: Service "${serviceName}" not found]`;
    }
    
    return `<div class="affiliate-button-wrapper" data-service-name="${service.name}" data-service-url="${service.url}" data-text="${text}" data-variant="${variant}" data-tracking-id="${service.id}"></div>`;
  });
  
  // ServiceCTA の処理
  processedMarkdown = processedMarkdown.replace(serviceCTARegex, (match, serviceName, variant = 'primary') => {
    const service = services.find(s => s.name.toLowerCase() === serviceName.toLowerCase() || s.id === serviceName);
    if (!service) {
      return `[Error: Service "${serviceName}" not found]`;
    }
    
    const features = service.features || [];
    const suitableFor = service.suitableFor || [];
    
    return `<div class="service-cta-wrapper" data-service-name="${service.name}" data-service-url="${service.url}" data-features='${JSON.stringify(features)}' data-suitable-for='${JSON.stringify(suitableFor)}' data-variant="${variant}"></div>`;
  });
  
  return processedMarkdown;
}

// HTMLをReactエレメントに変換（コンポーネント置換付き）
export function renderMarkdownWithComponents(htmlContent: string, data: ComponentData = {}) {
  const { services = [] } = data;
  
  // HTMLをパースしてReactエレメントに変換
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // AffiliateButton のプレースホルダーを実際のコンポーネントに置換
  const affiliateButtonWrappers = doc.querySelectorAll('.affiliate-button-wrapper');
  affiliateButtonWrappers.forEach((wrapper, index) => {
    const serviceName = wrapper.getAttribute('data-service-name') || '';
    const serviceUrl = wrapper.getAttribute('data-service-url') || '';
    const text = wrapper.getAttribute('data-text') || '';
    const variant = wrapper.getAttribute('data-variant') as 'primary' | 'secondary' | 'success' || 'primary';
    const trackingId = wrapper.getAttribute('data-tracking-id') || '';
    
    // プレースホルダーを一意のIDに置換
    wrapper.innerHTML = `<div id="affiliate-button-${index}"></div>`;
  });
  
  // ServiceCTA のプレースホルダーを実際のコンポーネントに置換
  const serviceCTAWrappers = doc.querySelectorAll('.service-cta-wrapper');
  serviceCTAWrappers.forEach((wrapper, index) => {
    const serviceName = wrapper.getAttribute('data-service-name') || '';
    const serviceUrl = wrapper.getAttribute('data-service-url') || '';
    const features = JSON.parse(wrapper.getAttribute('data-features') || '[]');
    const suitableFor = JSON.parse(wrapper.getAttribute('data-suitable-for') || '[]');
    const variant = wrapper.getAttribute('data-variant') as 'primary' | 'secondary' | 'success' || 'primary';
    
    // プレースホルダーを一意のIDに置換
    wrapper.innerHTML = `<div id="service-cta-${index}"></div>`;
  });
  
  return doc.body.innerHTML;
}

// サーバーサイドでの使用
export async function processMarkdownToHTML(markdown: string, data: ComponentData = {}) {
  // 1. カスタムコンポーネント記法を処理
  const processedMarkdown = processMarkdownComponents(markdown, data);
  
  // 2. マークダウンをHTMLに変換
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  
  const htmlContent = await marked(processedMarkdown);
  
  // 3. h1タグを削除（記事レイアウトのh1タグと重複を避けるため）
  const htmlWithoutH1 = removeH1Tags(htmlContent);
  
  return htmlWithoutH1;
}

// HTMLからh1タグを削除する関数
function removeH1Tags(htmlContent: string): string {
  return htmlContent.replace(/<h1[^>]*>.*?<\/h1>/gi, '');
}

// クライアントサイドでのコンポーネント描画用
export interface ComponentRenderData {
  type: 'affiliate-button' | 'service-cta';
  props: any;
  elementId: string;
}

export function extractComponentData(htmlContent: string): ComponentRenderData[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const components: ComponentRenderData[] = [];
  
  // AffiliateButton データの抽出
  const affiliateButtonWrappers = doc.querySelectorAll('.affiliate-button-wrapper');
  affiliateButtonWrappers.forEach((wrapper, index) => {
    components.push({
      type: 'affiliate-button',
      elementId: `affiliate-button-${index}`,
      props: {
        href: wrapper.getAttribute('data-service-url') || '',
        text: wrapper.getAttribute('data-text') || '',
        variant: wrapper.getAttribute('data-variant') || 'primary',
        trackingId: wrapper.getAttribute('data-tracking-id') || '',
      }
    });
  });
  
  // ServiceCTA データの抽出
  const serviceCTAWrappers = doc.querySelectorAll('.service-cta-wrapper');
  serviceCTAWrappers.forEach((wrapper, index) => {
    components.push({
      type: 'service-cta',
      elementId: `service-cta-${index}`,
      props: {
        serviceName: wrapper.getAttribute('data-service-name') || '',
        serviceUrl: wrapper.getAttribute('data-service-url') || '',
        features: JSON.parse(wrapper.getAttribute('data-features') || '[]'),
        recommendedFor: JSON.parse(wrapper.getAttribute('data-suitable-for') || '[]'),
        variant: wrapper.getAttribute('data-variant') || 'primary',
      }
    });
  });
  
  return components;
}