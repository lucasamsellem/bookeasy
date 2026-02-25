'use client';

import useDeleteUser from '@/hooks/useDeleteUser';
import useFetchUsers from '@/hooks/useFetchUsers';
import { TrashIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import useModal from '@/hooks/useModal';
import { useState } from 'react';

export default function UsersList() {
  const { users } = useFetchUsers();
  const { deleteUser } = useDeleteUser();
  const { isOpen, openModal, closeModal } = useModal();

  const [userIdToDelete, setUserIdToDelete] = useState<null | number>(null);

  return (
    <>
      <div className='w-full overflow-x-auto'>
        <table className='min-w-full bg-white shadow-md rounded-xl overflow-hidden'>
          <thead className='bg-gray-100 text-left text-sm uppercase tracking-wider text-gray-600'>
            <tr>
              <th className='px-6 py-4'>Nom</th>
              <th className='px-6 py-4'>Email</th>
              <th className='px-6 py-4'>Rôle</th>
              <th className='px-6 py-4'>Profession</th>
              <th className='px-6 py-4'>Adresse</th>
              <th className='px-6 py-4'></th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-200 text-sm'>
            {users?.map((user) => (
              <tr key={user.id} className='hover:bg-gray-50 transition-colors'>
                <td className='px-6 py-4 font-medium text-gray-900'>
                  {user.firstName} {user.lastName}
                </td>

                <td className='px-6 py-4 text-gray-700'>{user.email}</td>

                <td className='px-6 py-4'>
                  <span className='px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700'>
                    {user.role}
                  </span>
                </td>

                <td className='px-6 py-4 text-gray-700'>{user.profession}</td>

                <td className='px-6 py-4 text-gray-700'>{user.city}</td>

                <td>
                  <button
                    onClick={() => {
                      setUserIdToDelete(user.id);
                      openModal();
                    }}
                  >
                    <TrashIcon className='size-5' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users?.length && (
          <div className='text-center py-10 text-gray-500'>Aucun utilisateur trouvé.</div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Supprimer l'utilisateur"
        onConfirm={async () => {
          if (!userIdToDelete) return;
          await deleteUser(userIdToDelete);
          closeModal();
        }}
        confirmLabel='Supprimer'
        variant='danger'
      >
        <p>Cette action est irréversible. Veux-tu vraiment supprimer cet utilisateur ?</p>
      </Modal>
    </>
  );
}
