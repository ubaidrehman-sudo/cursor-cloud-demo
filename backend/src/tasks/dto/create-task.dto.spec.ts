import { validate } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

describe('CreateTaskDto', () => {
  const validateTitle = (title: string) => {
    const dto = new CreateTaskDto();
    dto.title = title;

    return validate(dto);
  };

  it('requires task titles to be at least 3 characters long', async () => {
    const errors = await validateTitle('ab');

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      minLength: 'Task title must be at least 3 characters long.',
    });
  });

  it('allows task titles within the 3 to 100 character range', async () => {
    await expect(validateTitle('abc')).resolves.toHaveLength(0);
    await expect(validateTitle('a'.repeat(100))).resolves.toHaveLength(0);
  });

  it('requires task titles to be at most 100 characters long', async () => {
    const errors = await validateTitle('a'.repeat(101));

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toMatchObject({
      maxLength: 'Task title must be at most 100 characters long.',
    });
  });
});
