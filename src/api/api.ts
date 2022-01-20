import axios, { AxiosError } from "axios";
import { enc, MD5 } from "crypto-js";
import { toast } from "react-toastify";
import config from "../config/config";

const BaseURL = config.BaseURL;

const client = axios.create({
    baseURL: BaseURL,
});

export async function ValidateToken(token: string | null): Promise<Boolean> {
    if (token === null) return false;

    try {
        await client.get("/auth/ping", { headers: { Authorization: `Bearer ${token}` } });
        return true;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const serverError = err as AxiosError<BaseResponse>;
            toast.error(serverError.message);
        } else {
            toast.error(`network error: ${err}`);
        }
        return false;
    }
}

export function SetToken(token: string) {
    localStorage.setItem("ICCToken", token);
}

export function GetToken(): string | null {
    return localStorage.getItem("ICCToken");
}

interface BaseResponse {
    status_code: number;
    message: string;
}

interface GetBatchImagesResponse extends BaseResponse {
    data: ImageDetail[];
}

export interface ImageDetail {
    timestamp: Date;
    image_url: string;
    image_id: string;
    tags: string[];
}

export async function GetBatchImages(
    before: Date,
    tags: string[],
    limit: number
): Promise<GetBatchImagesResponse | null> {
    try {
        const timestamp = before.getTime();
        const resp = await client.get<GetBatchImagesResponse>(
            `/images?before=${timestamp}&tag=${tags.join(",")}&limit=${limit}`
        );
        return resp.data;
    } catch (e) {
        toast.error(`get image failed: ${e}`);
        return null;
    }
}

interface PresignedURLInfo extends BaseResponse {
    data: {
        presigned_uri: string;
        image_id: string;
    };
}

async function getPreSignedURL(filetype: string, md5sum: string): Promise<PresignedURLInfo> {
    const resp = await client.post<PresignedURLInfo>(
        "/auth/image/upload",
        { image_type: filetype, md5_sum: md5sum },
        { headers: { Authorization: `Bearer ${GetToken()}` } }
    );
    return resp.data;
}

interface CompleteImageUploadResponse extends BaseResponse {
    data: {
        image_id: string;
        image_url: string;
        tags: string[];
    };
}

async function completeImageUpload(imageID: string, tags: string[]): Promise<ImageDetail> {
    const resp = await client.post<CompleteImageUploadResponse>(
        "/auth/image/complete",
        { image_id: imageID, tags: tags },
        { headers: { Authorization: `Bearer ${GetToken()}` } }
    );
    return {
        image_id: resp.data.data.image_id,
        image_url: resp.data.data.image_url,
        tags: resp.data.data.tags,
        timestamp: new Date(),
    };
}

async function calculateMd5(file: File): Promise<string> {
    // eslint-disable-next-line no-unused-vars
    return new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const hasher = MD5(enc.Latin1.parse(fileReader.result as string));
            const hashsum = hasher.toString(enc.Hex);
            resolve(hashsum);
        };
        fileReader.readAsBinaryString(file);
    });
}

export async function UploadImage(
    file: File,
    tags: string[],
    // eslint-disable-next-line no-unused-vars
    onProgress: (e: ProgressEvent) => void
): Promise<ImageDetail | null> {
    try {
        const md5sum = await calculateMd5(file);

        const resp = await getPreSignedURL(file.type, md5sum);
        await axios.put(resp.data.presigned_uri, file, {
            headers: {
                "Content-Type": file.type,
                "x-amz-meta-x-icc-md5": md5sum,
            },
            onUploadProgress: onProgress,
        });
        const imgDetail = await completeImageUpload(resp.data.image_id, tags);
        toast.success("upload success");
        return imgDetail;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const resp = err.response.data as BaseResponse;
            toast.error(resp.message);
        } else {
            toast.error(`network error: ${err}`);
        }
        return null;
    }
}

interface GetAllTagsResponse extends BaseResponse {
    data: Tag[];
}

export interface Tag {
    tag_name: string;
    aliases: string[];
}

export async function GetAllTags(): Promise<Tag[]> {
    try {
        const resp = await client.get<GetAllTagsResponse>("/auth/image/tag", {
            headers: { Authorization: `Bearer ${GetToken()}` },
        });
        return resp.data.data;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const resp = err.response.data as BaseResponse;
            toast.error(resp.message);
        } else {
            toast.error(`network error: ${err}`);
        }
        return [];
    }
}

export async function AddTags2Image(imageID: string, tags: string[]): Promise<Boolean> {
    try {
        await client.post(
            "/auth/image/tag",
            { image_id: imageID, tags: tags },
            { headers: { Authorization: `Bearer ${GetToken()}` } }
        );
        toast.success("update tags successfully");
        return true;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const resp = err.response.data as BaseResponse;
            toast.error(resp.message);
        } else {
            toast.error(`network error: ${err}`);
        }
        return false;
    }
}

export async function DeleteTags2Image(imageID: string, tags: string[]): Promise<Boolean> {
    try {
        await client.delete("/auth/image/tag", {
            data: { image_id: imageID, tags: tags },
            headers: { Authorization: `Bearer ${GetToken()}` },
        });
        toast.success("update tags successfully");
        return true;
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const resp = err.response.data as BaseResponse;
            toast.error(resp.message);
        } else {
            toast.error(`network error: ${err}`);
        }
        return false;
    }
}
