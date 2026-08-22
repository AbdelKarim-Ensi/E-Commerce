import { jest } from '@jest/globals';

/**
 * On mocke uniquement le module @supabase/supabase-js, pas StorageService
 * lui-même. Ça permet de garder la VRAIE logique de validation (magic bytes
 * via file-type, resize/compression via sharp) exercée dans les tests, tout
 * en évitant de taper le vrai bucket Supabase à chaque run.
 */
export function buildSupabaseMock() {
  const uploadMock = jest.fn().mockResolvedValue({ error: null } as any);
  const listMock = jest
    .fn()
    .mockResolvedValue({ data: [], error: null } as any);
  const removeMock = jest.fn().mockResolvedValue({ error: null } as any);
  const getPublicUrlMock = jest.fn((path: string) => ({
    data: {
      publicUrl: `https://fake-project.supabase.co/storage/v1/object/public/product-images/${path}`,
    },
  }));

  const fakeClient = {
    storage: {
      from: jest.fn(() => ({
        upload: uploadMock,
        list: listMock,
        remove: removeMock,
        getPublicUrl: getPublicUrlMock,
      })),
    },
  };

  return {
    createClient: jest.fn(() => fakeClient),
    mocks: { uploadMock, listMock, removeMock, getPublicUrlMock },
  };
}
