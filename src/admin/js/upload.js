import './lib/moxie'
import './lib/plupload'
import './lib/qiniu'
import eventHub from './event-hub'

const view = { el: '#upload' }

const model = {}

const controller = {
    view: null,
    model: null,
    init() {
        this.view = view
        this.model = model
        this.initQiniu()
    },
    initQiniu() {
        const uploader = Qiniu.uploader({
            runtimes: 'html5', // 上传模式,依次退化
            browse_button: 'pickfiles', // 上传选择的点选按钮，**必需**
            uptoken_url: 'http://localhost:8000/uptoken',
            domain: 'http://p5w2gr4yo.bkt.clouddn.com/', // bucket 域名，下载资源时用到，**必需**
            get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的token
            max_file_size: '40mb', // 最大文件体积限制
            dragdrop: true, // 开启可拖曳上传
            drop_element: 'upload', // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            init: {
                FilesAdded: (up, files) => {
                    plupload.each(files, (file) => {
                        // 文件添加进队列后,处理相关的事情
                    })
                },
                BeforeUpload: (up, file) => {
                    // 每个文件上传前,处理相关的事情
                },
                UploadProgress: (up, file) => {
                    // 每个文件上传时,处理相关的事情
                    console.log('上传中')
                },
                FileUploaded: (up, file, info) => {
                    // 每个文件上传成功后,处理相关的事情
                    // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                    const domain = up.getOption('domain')
                    const response = JSON.parse(info.response)
                    const sourceLink = encodeURI(domain + response.key)
                    console.log('上传完毕')
                    eventHub.emit('uploaded', { name: response.key, url: sourceLink })
                },
                Error: (up, err, errTip) => {
                    // 上传出错时,处理相关的事情
                },
                UploadComplete: () => {
                    // 队列文件处理完毕后,处理相关的事情
                },
            }
        })
    }
}

controller.init()