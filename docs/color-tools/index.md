---
pageClass: index-page
title: Color Tools
summary: 在创意与代码之间，让色彩准确而自由地流动。
---

<template>
  <div class="page-container">
    <div class="logo-div" style="margin-top: 30px;">
      <img src="./logo.svg" width="80" />
      <div class="product-title"> Color Tools</div>
    </div>
    <div class="description-div" style="margin-top: 10px;">
      <div>在创意与代码之间，让色彩准确而自由地流动。</div>
      <div class="cta-div">
        <a class="cta-button" href="https://color.cp3hnu.com" target="_blank" rel="noopener noreferrer">
          Let's go
          <span class="cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
    <div class="image-container">
      <div class="screenshot-div">
        <img class="screenshot-image" src="./screenshot.png" />
      </div>
    </div>
    <div class="features-section">
      <h2 class="features-title">功能介绍</h2>
      <div class="features-grid">
        <div class="feature-card" v-for="tool in tools" :key="tool.name">
          <h3 class="feature-name">{{ tool.name }}</h3>
          <p class="feature-desc">{{ tool.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    metaInfo: {
      title: "Color Tools"
    },
    name: "Color Tools",
    data() {
      return {
        tools: [
          {
            name: "颜色转换",
            description: "支持 Hex、RGB、HSL、HSV、HWB、Lab、LCH、OKLab、OKLCh 等多种格式互转",
          },
          {
            name: "Tailwind 色阶",
            description: "以单色生成 50–950 九档 Tailwind v4 色阶，自动推断颜色名称和色阶档位",
          },
          {
            name: "明暗色阶",
            description: "从基准色批量生成加深与变浅色阶，可调节加深/变浅程度",
          },
          {
            name: "颜色拾取器",
            description: "获取图片像素颜色，放大镜辅助精确定位，同步输出多种颜色格式",
          },
          {
            name: "图片滤镜",
            description: "修改图片颜色并实时预览滤镜效果，支持手动微调参数，快速得到目标色调",
          },
          {
            name: "颜色渐变",
            description: "快速创建线性、径向、锥形渐变色，轻松添加 Color Stop，支持实时预览以达到目标效果",
          },
          {
            name: "颜色滤镜",
            description: "通过源色与目标色，自动推算 hue-rotate、saturate、brightness 等 CSS filter 参数",
          },
          {
            name: "主题切换",
            description: "指定原主题色与新主题色，批量转换 CSS / Less / Sass 颜色变量，保持系统配色一致",
          },
          {
            name: "主题资源",
            description: "精选的前端组件库、设计系统和配色工具资源，帮助您快速找到完美的颜色方案",
          },
        ],
      };
    },
  }
</script>

<style scoped>
  .logo-div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
  }
  .product-title {
    margin-left: 15px;
    font-size: 22px;
    color: #000;
    font-weight: 500;
  }

  .description-div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cta-div {
    margin-top: 30px;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    border-radius: 999px;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
    background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
    text-decoration: none !important;
    color: #fff;
  }

  .cta-arrow {
    display: inline-block;
    transition: transform 0.2s ease;
  }

  .cta-button:hover .cta-arrow {
    transform: translateX(4px);
  }

  .image-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 40px;
  }
   .screenshot-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  .screenshot-image {
    width: 800px;
    max-width: 70%;
  }

  .features-section {
    max-width: 960px;
    margin: 60px auto 40px;
    padding: 0 24px;
  }

  .features-title {
    text-align: center;
    font-size: 22px;
    font-weight: 500;
    color: #000;
    margin: 0 0 32px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .feature-card {
    padding: 20px;
    border-radius: 12px;
    background: #f8f8ff;
    border: 1px solid rgba(79, 70, 229, 0.12);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .feature-card:hover {
    border-color: rgba(79, 70, 229, 0.3);
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.1);
  }

  .feature-name {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: bolder;
    color: black;
  }

  .feature-card:hover .feature-name {
    color: #4f46e5;
  }

  .feature-desc {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #444;
  }

  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .features-grid {
      grid-template-columns: 1fr;
    }
  }
 
</style>
