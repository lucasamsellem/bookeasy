'use client';

import useDeleteUser from '@/hooks/users/useDeleteUser';
import useFetchUsers from '@/hooks/users/useFetchUsers';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/Modal';
import useModal from '@/hooks/useModal';
import { useRef, useState } from 'react';
import useUpdateUser from '@/hooks/users/useUpdateUser';
import { RegisterForm, Input, RegisterFormRef } from './RegisterForm';
import { User } from '@shared/types/sharedTypes';
import { capitalizeFirstLetter } from '@/utils/utils';
import styles from './UsersTable.module.scss';

const editableKeys: (keyof User)[] = ['firstName', 'lastName', 'city', 'street', 'streetNumber'];

const keyInFrench = (key: keyof User) => {
  switch (key) {
    case 'firstName':
      return 'Prénom';
    case 'lastName':
      return 'Nom';
    case 'city':
      return 'Ville';
    case 'street':
      return 'Rue';
    case 'streetNumber':
      return 'N°';
  }
};

export default function UsersTable() {
  const { users } = useFetchUsers();
  const { deleteUser, isUserDeleting } = useDeleteUser();
  const { updateUser, isUserUpdating } = useUpdateUser();

  const formRef = useRef<RegisterFormRef>(null);

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
  const {
    isOpen: isCreateOpen,
    openModal: openCreateModal,
    closeModal: closeCreateModal,
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

  const roleClass = (role: string) => {
    switch (role) {
      case 'customer':
        return 'customer';
      case 'professional':
        return 'professional';
      case 'superAdmin':
        return 'superAdmin';
      default:
        return 'default';
    }
  };

  return (
    <div className={styles['users-table']}>
      <h2>Liste des utilisateurs</h2>

      <div className={styles['table-wrapper']}>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Profession</th>
              <th>Adresse</th>
              <th></th>
              <th>
                <button onClick={openCreateModal}>
                  <PlusIcon className='size-5' />
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td className={`role ${roleClass(user.role)}`}>
                  <span>{capitalizeFirstLetter(user.role)}</span>
                </td>
                <td>{user.profession}</td>
                <td>{user.city ? `${user.streetNumber} ${user.street}, ${user.city}` : null}</td>
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

        {!users?.length && <div className={styles.empty}>Aucun utilisateur trouvé.</div>}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        title='Nouvel utilisateur'
        onConfirm={async () => {
          await formRef.current?.submit();
          closeCreateModal();
        }}
        confirmLabel='Créer'
      >
        <RegisterForm ref={formRef} allowedRoles={['customer', 'professional', 'superAdmin']} />
      </Modal>

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
        <form className={`${styles.form} space-y-5`} onSubmit={(e) => e.preventDefault()}>
          {editableKeys.map((key) => (
            <Input
              key={key}
              label={keyInFrench(key) ?? key}
              defaultValue={userToUpdate?.[key] ?? ''}
              onChange={(e) => setUserUpdatedValues((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          ))}
        </form>
      </Modal>
    </div>
  );
}
