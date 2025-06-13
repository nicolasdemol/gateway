// utils/db.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt-ts";

const prisma = new PrismaClient();

/**
 * Récupère un utilisateur par son email
 * @param email Email de l'utilisateur
 * @returns Utilisateur ou null
 */
export async function getUser(email: string) {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

/**
 * Crée un nouvel utilisateur avec hash de mot de passe
 * @param email string
 * @param password string (en clair)
 * @returns l'utilisateur créé
 */
export async function createUser(email: string, password: string) {
  const hashedPassword = await hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: email.split("@")[0], // optionnel : nom par défaut
    },
  });
}

/**
 * Crée une nouvelle vidéo (local ou remote) dans la base de données
 * @param title Titre de la vidéo
 * @param url URL de la vidéo (chemin ou lien distant)
 * @param userId ID de l'utilisateur propriétaire
 * @param source LOCAL ou REMOTE
 */
export async function createVideo({
  title,
  url,
  userId,
  source,
  encrypted = false,
}: {
  title: string;
  url: string;
  userId: number;
  source: "LOCAL" | "REMOTE";
  encrypted?: boolean; // optionnel : par défaut false
}) {
  return prisma.video.create({
    data: {
      title,
      url,
      userId,
      source,
      encrypted,
    },
  });
}

/**
 * Supprime une vidéo par son ID et l'ID utilisateur (optionnel pour sécurité)
 * @param id ID de la vidéo
 * @param userId ID de l'utilisateur (optionnel : pour restreindre la suppression)
 */
export async function removeVideo({
  id,
  userId,
}: {
  id: number;
  userId?: number;
}) {
  const whereClause = {
    id,
    ...(userId && { userId }),
  };

  return prisma.video.delete({
    where: whereClause,
  });
}

export async function getVideos({
  userId,
  page = 1,
  limit = 10,
  source,
}: {
  userId?: number;
  page?: number;
  limit?: number;
  source?: "LOCAL" | "REMOTE";
}) {
  const where = {
    ...(userId && { userId }),
    ...(source && { source }),
  };

  return prisma.video.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
}

export async function getVideoById(id: number) {
  return prisma.video.findUnique({
    where: { id },
  });
}

export async function deleteVideo(id: number) {
  return prisma.video.delete({ where: { id } });
}
