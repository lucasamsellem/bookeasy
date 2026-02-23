import { RegisterBody } from './RegisterForm';

type PasswordStrengthBarProps = {
  form: RegisterBody;
};

export default function PasswordStrengthBar({ form }: PasswordStrengthBarProps) {
  const { password } = form;

  const criteria = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Number', valid: /\d/.test(password) },
    { label: 'Special character', valid: /[^A-Za-z\d]/.test(password) },
  ];

  const validCount = criteria.filter((c) => c.valid).length;
  const strengthPercent = (validCount / criteria.length) * 100;

  // couleur de la barre selon le nombre de critères validés
  const barColor =
    validCount <= 2 ? 'bg-red-500' : validCount === 3 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className='space-y-2'>
      <div className='h-2 w-full rounded bg-gray-200'>
        <div
          className={`h-2 rounded transition-all duration-300 ${barColor}`}
          style={{ width: `${strengthPercent}%` }}
        />
      </div>

      <ul className='text-xs text-gray-500 space-y-1'>
        {criteria.map((c, i) => (
          <li key={i} className={`${c.valid ? 'line-through text-gray-400' : ''}`}>
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
