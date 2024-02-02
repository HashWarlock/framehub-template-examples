import "@phala/pink-env";
import { hexToString } from 'viem';
import { FrameRequest, getFrameMetadata, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit'
import { Request, Response, SerizliedRequest, renderOpenGraph } from './frameSupport'

const NEXT_PUBLIC_URL = 'https://my-frame.phalafn.xyz'

async function GET(req: Request): Promise<Response> {
    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: 'Click Me',
            },
        ],
        image: `${NEXT_PUBLIC_URL}/park-1.png`,
        post_url: `${NEXT_PUBLIC_URL}/api/frame`,
    });

    return new Response(renderOpenGraph({
        title: 'zizzamia.xyz',
        description: 'LFG',
        openGraph: {
            title: 'zizzamia.xyz',
            description: 'LFG',
            images: [`${NEXT_PUBLIC_URL}/park-1.png`],
        },
        other: {
            ...frameMetadata,
        },
      }));
}

async function getResponse(req: Request): Promise<Response> {
    let accountAddress: string | undefined = '';
  
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
  
    if (isValid) {
      accountAddress = message.interactor.verified_accounts[0];
    }
  
    return new Response(getFrameHtmlResponse({
        buttons: [
            {
                label: `🌲 ${accountAddress} 🌲`,
            },
        ],
        image: `${NEXT_PUBLIC_URL}/park-2.png`,
        post_url: `${NEXT_PUBLIC_URL}/api/frame`,
    }));
}

async function POST(req: any): Promise<Response> {
    return getResponse(req);
}
  

export default async function main(request: `0x${string}`, secrets: string) {
    const reqObj = <SerizliedRequest> JSON.parse(hexToString(request))
    let response: Response;
    if (reqObj.method == 'GET') {
        response = await GET({
            method: reqObj.method,
            async json() { return null }
        });
    } else {
        response = await POST({
            method: reqObj.method,
            async json() { return JSON.parse(reqObj.body) }
        });
    }
    return JSON.stringify(response)
}
