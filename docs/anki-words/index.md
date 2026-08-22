---
pageClass: index-page
title: 单词乐园
summary: 在创意与代码之间，让色彩准确而自由地流动。
---

<template>
  <div class="page-container">
    <div class="logo-div" style="margin-top: 30px;">
      <img src="./logo.png" width="80" />
      <div class="product-title">单词乐园</div>
    </div>
    <div class="description-div" style="margin-top: 10px;">
      <div>基于 FSRS 间隔重复算法，把单词记得更牢</div>
      <div class="cta-div">
        <a class="cta-button" href="https://words.cp3hnu.com" target="_blank" rel="noopener noreferrer">
          Let's go
          <span class="cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
    <div class="image-container">
      <div class="screenshot-div">
        <p>首页</p>
        <img class="screenshot-image" src="./screenshot-home.png" />
      </div>
    </div>
    <div class="image-container">
      <div class="screenshot-div">
        <p>认读练习</p>
        <img class="screenshot-image" src="./screenshot-read.png" />
      </div>
    </div>
    <div class="image-container">
      <div class="screenshot-div">
        <p>认读练习，查看答案，评分</p>
        <img class="screenshot-image" src="./screenshot-read-answer.png" />
      </div>
    </div>
    <div class="image-container">
      <div class="screenshot-div">
        <p>默写练习</p>
        <img class="screenshot-image" src="./screenshot-write.png" />
      </div>
    </div>
     <div class="image-container">
      <div class="screenshot-div">
        <p>默写练习，查看答案，评分</p>
        <img class="screenshot-image" src="./screenshot-write-answer.png" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    metaInfo: {
      title: "单词乐园"
    },
    name: "单词乐园",
    data() {
      return {
        
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
    margin-bottom: 40px;
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
