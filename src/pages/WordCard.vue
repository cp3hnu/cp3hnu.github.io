<template>
    <Layout>
        <div class="logo-div">
            <img :src="appLogo" width="80px" />
            <div class="product-title">英语单词卡</div>
        </div>
        <div class="logo-div" style="margin-top: 15px">
            <div class="product-detail">专为3~8岁儿童打造的一款英语启蒙学习软件，让小孩子爱上说英语。</div>
        </div>
        <div class="image-container">
            <div class="screenshot-div">
                <g-image class="screenshot-image" src="~/products/wordCard/screenshot-1.png" quality="100"/>
            </div>
            <div class="screenshot-div">
                <g-image class="screenshot-image" src="~/products/wordCard/screenshot-2.png" quality="100"/>
            </div>
        </div>
        <div class="download-container">
            <g-link to="https://apps.apple.com/cn/app/%E8%8B%B1%E8%AF%AD%E5%8D%95%E8%AF%8D%E5%8D%A1-%E5%84%BF%E7%AB%A5%E8%8B%B1%E8%AF%AD/id1514527241">
                <img :src="appStore" width="200px"/>
            </g-link>
        </div>
        <div class="description-div">
            "<b>英语单词卡</b>" 是为3~8岁儿童打造的一款英语启蒙学习软件，让小孩子爱上说英语。也适合家长小孩一起学习，家长掌握之后能更好地辅导小孩子学习英语。
            <h1>我们的思考</h1>
            <div style="line-height: 28px">
                儿童英语学习从哪里开始呢？我们反思小孩子是怎样学习汉语的。
                小孩子一开始既不认识 [苹果] 两个汉字，又不懂 [píng guǒ] 怎么拼读，
                但是他会说、听得懂。这主要是父母在日常生活中教小孩子说苹果 [píng guǒ]，
                小孩子通过模仿父母的发音也就学会了说 苹果 [píng guǒ]，学会了说汉语。
                研究表明，模仿是小孩子学习知识最主要方式，而且小孩子的模仿能力极强。
                同样如果父母在日常生活中教小孩子说 apple ['æpl]，小孩子通过模仿，就能开口说英语。
            </div>
            <h1>适用于</h1>
            <div style="line-height: 28px">
                家长想教小孩子说英语，但是担心自己发音不标准，不标准发音反而容易误导小孩子，
                通过 "<b>英语单词卡</b>"，能够帮助家长和小孩子正确地发音，正确地说单词，同时通过精美单词卡让小孩子爱上说英语。
            </div>
            <h1>功能特色</h1>
            <h3>精美的单词卡</h3>
            精选 330 个日常生活常用单词，精美的单词卡生动形象，帮忙小孩子更好地记忆
            <h3>标准英式发音</h3>
            牛津字典一样标准的发音，避免不标准的发音误导小孩子
            <h3>跟读，智能矫正发音</h3>
            采用智能的语音识别系统，给小孩子的英语发音实时打分，矫正发音
            <h3>反复练习，达到标准发音</h3>
            一键展示所有单词的发音评分，对于发音不准确的单词可以多听多读多练，最终达到标准发音
            <h3>测验</h3>
            听、说、读、写，让小孩子全面掌握单词，做到听得懂、说得出、认得出、写得出
            <h3>暗黑模式</h3>
            可以降低对眼睛的刺激，让眼部肌肉放松，保护儿童视力
        </div>
    </Layout>
</template>

<script>
    import appStore from '~/asset/appstore.png'
    import appLogo from '~/products/wordCard/logo.png'

    export default {
        metaInfo: {
            title: '英语单词卡'
        },
        name: "WordCard",
        data() {
            return {
                appStore,
                appLogo
            }
        }
    }
</script>

<style scoped>
    .logo-div {
        margin-top: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
    }
    .product-title {
        margin-left: 15px;
        font-size: 20px;
        color: black;
    }
    .product-detail {
        font-size: 18px;
        color: #333333;
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
        margin-top: 30px;
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
        width: 550px;
        max-width: 80%;
    }
    .description-div {
        padding: 40px;
    }
</style>