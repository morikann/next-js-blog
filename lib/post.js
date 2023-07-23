import path from "path";
import fs from "fs";
import matter from 'gray-matter';
import {remark} from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd() /* current working directory (root) */, "post"); // postsディレクトリを取得

// mdファイルのデータを取り出す
export function getPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, ""); // md拡張子を取り除く。ファイル名(id)

        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8"); // ファイルの中身を見る

        const matterResult = matter(fileContents);

        // idとデータを返す
        return {
            id,
            ...matterResult.data, // メタデータが配列として入っている
        }
    });

    return allPostsData;
}

// getStaticPathでreturnで使うpathを取得する
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ""),
            }
        }
    })
}

// idに基づいてブログ投稿データを返す
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContent = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContent);

    // matterResult.data：meta data取得
    // matterResult.content：マークダウンのコンテンツ取得
    const blogContent = await remark().use(html).process(matterResult.content); // マークダウンをHTMLに変換

    const blogContentHTML = blogContent.toString();

    return {
        id,
        blogContentHTML,
        ...matterResult.data,
    }
}
