import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { calculatorValidationSchema } from 'validationSchema/calculators';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.calculator
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCalculatorById();
    case 'PUT':
      return updateCalculatorById();
    case 'DELETE':
      return deleteCalculatorById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCalculatorById() {
    const data = await prisma.calculator.findFirst(convertQueryToPrismaUtil(req.query, 'calculator'));
    return res.status(200).json(data);
  }

  async function updateCalculatorById() {
    await calculatorValidationSchema.validate(req.body);
    const data = await prisma.calculator.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCalculatorById() {
    const data = await prisma.calculator.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
