---
pageClass: index-page
title: Starry
meta:
  - name: apple-itunes-app
    content: app-id=1281893044, app-argument=https://www.joylearn123.com/starry/
---
<template>
  <div class="page-container">
    <div class="logo-div" style="margin-top: 30px;">
      <img src="./logo.png" width="80" />
      <div class="product-title">Starry</div>
    </div>
    <div class="logo-div" style="margin-top: 10px;">
      <div>Group, manage and read your starred repositories on GitHub.</div>
    </div>
    <div class="image-container">
      <div class="screenshot-div">
        <img class="screenshot-image" src="./screenshot.png" />
      </div>
    </div>
    <div class="video-container">
      <video class="video" controls>
        <source src="./video.mp4" type="video/mp4">
      </video>
    </div>
    <div class="download-container">
      <a target="_blank" href="https://apps.apple.com/cn/app/starry-manage-github-stars/id1281893044?mt=12">
        <img src="/assets/img/appstore.png" width="200"/>
      </a>
    </div>
    <div class="description-div">
      <h3>Starry has the following features.</h3>
      <ul>
        <li>
          <p>Group you starred repositories on GitHub</p>
        </li>
        <li>
          <p>Synchronize your groups to all of your iPhone, iPad and Mac with iCloud. Synchronize when the app will enter foreground.</p>
        </li>
        <li>
          <p>Sort groups by drag and drop</p>
        </li>
        <li>
          <p>Language groups based on the languages of repositories</p>
        </li>
        <li>
          <p>Load repositories quickly by caching documents and images of repositories</p>
        </li>
        <li>
          <p>Search starred repositories via the name, owner, and description of repository</p>
        </li>
        <li>
          <p>Sort starred repositories by the starred date, star count of repository, repository name and update date of repository</p>
        </li>
        <li>
          <p>Unstar repositories</p>
        </li>
        <li>
          <p>Handoff</p>
        </li>
        <li>
          <p>Spotlight search (iOS)</p>
        </li>
        <li>
          <p>Pay once ($2.99), use on iPhone, iPad and Mac</p>
        </li>
      </ul>
    </div>
    <div class="description-div">
      <h3>Little known details.</h3>
      <ul>
        <li><strong>Delete group:</strong> cmd + delete</li>
        <li><strong>Copy repository to a group:</strong> Hold down the option key and drag repository to a group</li>
        <li><strong>Reverse order:</strong> Click the same button at the top of the middle column twice</li>
        <li><strong>Back or Forward in repository document page:</strong> swipe mouse or trackpad</li>
        <li><strong>Cancel refreshing starred repositories from GitHub:</strong> Click the rotating refresh button</li>
        <li><strong>Create new group:</strong> cmd + a</li>
        <li><strong>Toggle read mode:</strong> cmd + r</li>
        <li><strong>Increase font size of repository document:</strong> cmd + +</li>
        <li><strong>Decrease font size of repository document:</strong> cmd + -</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    metaInfo: {
      title: 'Starry'
    },
    name: "Starry"
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
  .screenshot-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  .download-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0;
  }
  .video-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
  }
  .image-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 40px;
  }
  .screenshot-image {
    width: 800px;
    max-width: 70%;
  }
  .video {
    width: 640px;
    max-width: 80%;
  }
  .description-div {
    padding: 0 40px 10px;
  }
  .description-div li {
    margin: 10px 0;
    color: #000;
  }
</style>