import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './UserForm.css';

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  password: yup.string().min(6, 'No mínimo 6 caracteres').required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas não coincidem')
    .required('Confirme a senha'),
});

type FormData = yup.InferType<typeof schema>;

const formatPhone = (value: string) => {
  value = value.replace(/\D/g, '');
  if (value.length <= 10) {
    return value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

const UserForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Dados enviados:', data);
    setSubmitted(true);
    reset();
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>Cadastro de Usuário</h2>
      {submitted && <p style={{ color: 'green' }}>Cadastro realizado com sucesso!</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label>Nome</label>
          <input {...register('name')} />
          <p style={{ color: 'red' }}>{errors.name?.message}</p>
        </div>

        <div>
          <label>E-mail</label>
          <input type="email" {...register('email')} />
          <p style={{ color: 'red' }}>{errors.email?.message}</p>
        </div>

        <div>
          <label>Telefone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                onChange={(e) => field.onChange(formatPhone(e.target.value))}
              />
            )}
          />
          <p style={{ color: 'red' }}>{errors.phone?.message}</p>
        </div>

        <div>
          <label>Senha</label>
          <input type="password" {...register('password')} />
          <p style={{ color: 'red' }}>{errors.password?.message}</p>
        </div>

        <div>
          <label>Confirmar Senha</label>
          <input type="password" {...register('confirmPassword')} />
          <p style={{ color: 'red' }}>{errors.confirmPassword?.message}</p>
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default UserForm;
