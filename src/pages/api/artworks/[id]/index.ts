import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { artworkValidationSchema } from 'validationSchema/artworks';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.artwork
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getArtworkById();
    case 'PUT':
      return updateArtworkById();
    case 'DELETE':
      return deleteArtworkById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getArtworkById() {
    const data = await prisma.artwork.findFirst(convertQueryToPrismaUtil(req.query, 'artwork'));
    return res.status(200).json(data);
  }

  async function updateArtworkById() {
    await artworkValidationSchema.validate(req.body);
    const data = await prisma.artwork.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteArtworkById() {
    const data = await prisma.artwork.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
