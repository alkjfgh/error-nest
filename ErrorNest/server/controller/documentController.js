const Document = require("../db/schema/document") // Get document schema
const File = require("../db/schema/file")
const logger = require("../log/logger")

/** document select all */
const documentSelect = async (req, res, next) => {
    //TODO 파일: 으로 시작하는 문서 처리.
    const title = req.params[0]
    const version = parseInt(req.query.version) || false

    // title이 "파일:"으로 시작하는지 확인
    if (title.startsWith("파일:")) {
        const options = { fileName: title.substring(3) }
        const file = await File.findOne(options)// 몽고디비의 db.users.find({}) 쿼리와 같음
        const data = {
            title: title,
            fileName: options.fileName,
            filePath: file.path,
            fileDes: file.fileDes,
            category: file.category,
            isFile : true
        }
        res.json(data)
    }else if(title.startsWith("분류:")){
        if(title.startsWith("분류:파일/")){
            const options = {
                category: title.split('/')[1]
            }
            const categories = await File.find(options)
            res.json({title: title, categories: categories, isCategory: true})
        }
    }
    else{
        try {
            const options = { title: title }
            if(version) options.version = version
            const document = await Document.findOne(options).sort('-version') // 몽고디비의 db.users.find({}) 쿼리와 같음
            if(document){
                const data = {title: title, content: document.content, hasDocument: true}
                if(version) data.recent = false
                res.json(data)
            }else{
                const data = {title: title, hasDocument: false}
                res.json(data)
            }
        } catch (err) {
            logger.error(err)
            next(err)
        }
    }
}

/** document insertTest */
const documentInsert = async (req, res, next) => {
    try {
        const document = {
            title: "봇치 더 록!",
            content: '<h2><a id="s-1" href="#top" class="content-link">1.</a><span>개요</span></h2>' +
                '                    <div>' +
                '                        <div>' +
                '                            일본의 4컷 만화. 작가는 하마지 아키[2][3]. 망가타임 키라라 MAX에서 2018년 2월호부터 4월호까지 게스트 연재 후, 같은 해 5월호부터 정식연재 중이다. 현지 팬들에게는 약칭인 \'보자로(ぼざろ)\'[4][5]로 흔히 불린다.' +
                '                            2019년 제5회 차세대 만화대상 만화 부문 8위에 입상했는데, 키라라 작품들 중 본 대상 첫 입상작이라는 의의가 있다.[6]' +
                '                        </div>' +
                '                    </div>' +
                '                    <h2><a id="s-2" href="#top" class="content-link">2.</a><span>줄거리</span></h2>' +
                '                    <div>' +
                '                        <blockquote>' +
                '                            <div>' +
                '                                "혼자라면 ROCK을 해라!!!!"' +
                '                                \'봇치\' 고토 히토리는 대인관계가 극도로 서투른 소녀. 무대에서 빛나는 밴드 활동을 동경해 기타 연주를 시작했지만, 친구가 없다. 그렇게 혼자서 기타를 연주하며 실력을 키우던 그녀는 자신의 연주 영상을 인터넷 사이트에 투고한다. 그러던 어느 날, \'결속 밴드\'에서 드럼을 치는 이지치 니지카가 먼저 그녀에게 말을 걸고. 그것을 계기로 그녀의 일상이 조금씩 바뀌기 시작하는데...?!' +
                '                            </div>' +
                '                        </blockquote>' +
                '                    </div>' +
                '<h2><a id="s-2.1" href="#top" class="content-link">2.1.</a><span>줄거리</span></h2>' +
                '                    <div>' +
                '                        <blockquote>' +
                '                            <div>' +
                '                                "혼자라면 ROCK을 해라!!!!"' +
                '                                \'봇치\' 고토 히토리는 대인관계가 극도로 서투른 소녀. 무대에서 빛나는 밴드 활동을 동경해 기타 연주를 시작했지만, 친구가 없다. 그렇게 혼자서 기타를 연주하며 실력을 키우던 그녀는 자신의 연주 영상을 인터넷 사이트에 투고한다. 그러던 어느 날, \'결속 밴드\'에서 드럼을 치는 이지치 니지카가 먼저 그녀에게 말을 걸고. 그것을 계기로 그녀의 일상이 조금씩 바뀌기 시작하는데...?!' +
                '                            </div>' +
                '                        </blockquote>' +
                '                    </div>',
        }
        const result = await Document.create(document);
        res.json({result})
    } catch (err) {
        logger.error(err)
        next(err)
    }
}

/** Exports CRUD functions */
module.exports = {documentSelect, documentInsert}