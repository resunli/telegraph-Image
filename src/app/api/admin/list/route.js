
import { getRequestContext } from '@cloudflare/next-on-pages';

// ...

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Content-Type': 'application/json'
};

export const runtime = 'edge';
export async function POST(request) {
  // 获取客户端的IP地址
  const { env, cf, ctx } = getRequestContext();
  // console.log(dd);
  try {
    let { page, query } = await request.json()

    if (query) {
      const ps = env.IMG.prepare(`SELECT * FROM imginfo WHERE url LIKE '%${query}%' LIMIT 10 OFFSET ${page} * 10`);
      const { results } = await ps.all()
      const total = await env.IMG.prepare(`SELECT COUNT(*) as total FROM imginfo WHERE url LIKE '%${query}%'`).first()
      return Response.json({
        "code": 200,
        "success": true,
        "message": "success",
        "data": results,
        "page": page,
        "total": total.total
      });
    } else {
      const ps = env.IMG.prepare(`SELECT * FROM imginfo ORDER BY id DESC LIMIT 10 OFFSET ${page} * 10`);
      const { results } = await ps.all()
      const total = await env.IMG.prepare(`SELECT COUNT(*) as total FROM imginfo`).first()
      return Response.json({
        "code": 200,
        "success": true,
        "message": "success",
        "data": results,
        "page": page,
        "total": total.total
      });
    }


  } catch (error) {

    return Response.json({
      "code": 500,
      "success": false,
      "message": error.message,
      "data": page,
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }

}



