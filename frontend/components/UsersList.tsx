'use client';

import useDeleteUser from '@/hooks/useDeleteUser';
import useFetchUsers from '@/hooks/useFetchUsers';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import useModal from '@/hooks/useModal';
import { useState } from 'react';
import useUpdateUser from '@/hooks/useUpdateUser';
import { Input } from './RegisterForm';
import { User } from '@backend/controllers/user.controller';

const editableKeys: (keyof User)[] = ['firstName', 'lastName', 'city', 'street', 'streetNumber'];

export default function UsersList() {
  const { users } = useFetchUsers();
  const { deleteUser, isUserDeleting } = useDeleteUser();
  const { updateUser, isUserUpdating } = useUpdateUser();

  const {
    isOpen: isDeletionOpen,
    openModal: openDeletetionModal,
    closeModal: closeDeletionModal,
  } = useModal();

  const {
    isOpen: isUpdateOpen,
    openModal: openUpdateModal,
    closeModal: closeUpdateModal,
  } = useModal();

  const [userIdToDelete, setUserIdToDelete] = useState<null | number>(null);
  const [userIdToUpdate, setUserIdToUpdate] = useState<null | number>(null);
  const userToUpdate = users?.find((user) => user.id === userIdToUpdate);

  const [userUpdatedValues, setUserUpdatedValues] = useState({
    firstName: userToUpdate?.firstName,
    lastName: userToUpdate?.lastName,
    city: userToUpdate?.city,
    street: userToUpdate?.street,
    streetNumber: userToUpdate?.streetNumber,
  });

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

                <td className='px-6 py-4 text-gray-700'>
                  {user.city ? (
                    <span>
                      {user.streetNumber} {user.street}, {user.city}
                    </span>
                  ) : null}
                </td>

                <td>
                  <button
                    onClick={() => {
                      setUserIdToDelete(user.id);
                      openDeletetionModal();
                    }}
                  >
                    <TrashIcon className='size-5' />
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => {
                      setUserIdToUpdate(user.id);
                      openUpdateModal();
                    }}
                  >
                    <PencilIcon className='size-5' />
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
        isOpen={isDeletionOpen}
        onClose={closeDeletionModal}
        isLoading={isUserDeleting}
        title="Supprimer l'utilisateur"
        onConfirm={async () => {
          if (!userIdToDelete) return;
          await deleteUser(userIdToDelete);
          closeDeletionModal();
        }}
        confirmLabel='Supprimer'
        variant='danger'
      >
        <p>Cette action est irréversible. Veux-tu vraiment supprimer cet utilisateur ?</p>
      </Modal>

      <Modal
        isOpen={isUpdateOpen}
        onClose={closeUpdateModal}
        title="Modifier l'utilisateur"
        isLoading={isUserUpdating}
        onConfirm={async () => {
          if (!userIdToUpdate || !userToUpdate) return;

          await updateUser({
            id: userToUpdate.id,
            firstName: userUpdatedValues.firstName ?? userToUpdate.firstName,
            lastName: userUpdatedValues.lastName ?? userToUpdate.lastName,
            city: userUpdatedValues.city ?? userToUpdate.city,
            street: userUpdatedValues.street ?? userToUpdate.street,
            streetNumber: userUpdatedValues.streetNumber ?? userToUpdate.streetNumber,
          });

          closeUpdateModal();
        }}
        confirmLabel='Modifier'
      >
        <form className='flex flex-col gap-y-5' onSubmit={(e) => e.preventDefault()}>
          {editableKeys.map((key) => (
            <Input
              key={key}
              label={key}
              defaultValue={userToUpdate?.[key] ?? ''}
              onChange={(e) => setUserUpdatedValues((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          ))}
        </form>
      </Modal>
    </>
  );
}
