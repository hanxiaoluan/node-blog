const nodemailer = require('nodemailer')
const { EMAIL_NOTICE } = require('../config')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(EMAIL_NOTICE.transportedConfig)

/**
 * @param {Object} params
 * @param {Email}
 * @param {String}
 * @example
 */
exports.sendEmail = async({ receiver, html, subject, text }) => {
	const info = await transporter.sendMail({
		from: EMAIL_NOTICE.transportedConfig.auth.user, // sender address
		to: receiver, // list of receivers
		subject: subject || EMAIL_NOTICE.subject, // Subject line
		text: text || EMAIL_NOTICE.text,
		html: html
	})

	// console.log('Message sent')
	return info
}

/**
 * 获取email 列表
 * @param {Object } target
 * @param {Number} userid
 */
function getEmailList(target, userId) {
	const temp = [EMAIL_NOTICE.transportedConfig.auth.user]
	const loop = item => {
		if (item.user.id !== userId && item.user.notice && item.user.email) {
			temp.push(item.user.email)
		}
	}
	loop(target)
	target.replies && target.replies.forEach(r => loop(r))

	return [...new Set(temp)]
}

exports.getEmailData = (article, disscussData, userId) => {
	const { WEB_HOST } = EMAIL_NOTICE
	const link = article.id !== -1 ? `${WEB_HOST}/article/${article.id}#discuss` : `${WEB_HOST}/about`

	const HTML_HEADER = `<h4 class='header'>您在文章 <span class='articke-title'><a href="${link}" class='href'>${article.title}</a></span>中的评论中有了新的回复....</h4>`

	const HTML_FOOTER = `<a href="${link}" class='href'>点击查看详情</a> 取消订阅,请回复TD.`

	function createDisscusInfo(item) {
		return `
            <div>
                <span class='username'>${item.user.name}</span><span class="create-time">${item.createdAt}:</span>
                ${item.content}
            </div>
        `
	}

	const HTML_CONTENT = `
        ${createDisscusInfo(disscussData)}
        <div>
            ${disscussData.replies.map(createDisscusInfo).join('')}
        </div>
    `

	const html = `
        <style>
            .header {
                margin-bottom:20px;
            }
            .username {
                color: #555;
                font-size:16px;
                font-weight:bold;
            }
            .article-title{
                font-size:24px;
            }
            .href {
                color:#40a9ff;
            }
            .create-time {
                font-size:12px;
            }
        </style>
        ${HTML_HEADER}

        ${HTML_CONTENT}
        <br />
        ${HTML_FOOTER}
    `

	return { html, emailList: getEmailList(disscussData, userId) }
}
