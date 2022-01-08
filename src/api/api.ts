import got from "got";

const BaseURL = "http://localhost:5000/api/v1";

const client = got.extend({ prefixUrl: BaseURL });

interface BaseResponse {
    StatusCode: number;
    Message: string;
}

interface GetAllImagesResponse extends BaseResponse {
    Data: {
        UpdatedAt: Date;
        ImageID: string;
        ExternalID: string;
        Tags: string[];
    };
}
export async function GetAllImages(before: Date, tags: string[], limit: number) {
    try {
        const timestamp = before.getTime();
        const resp = await client
            .get(`/images?before=${timestamp}&tag=${tags.join(",")}&limit=${limit}`)
            .json<GetAllImagesResponse>();
        console.log(resp);
    } catch (e) {
        console.log(e);
    }
}
