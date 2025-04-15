import { Sport } from 'src/sports/entities/sports.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class SportSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    try {
      const sportRepository = dataSource.getRepository(Sport);

      const sports = [
        {
          name: 'Yoga',
          description:
            'A group of physical, mental, and spiritual practices originating in ancient India.',
        },
        {
          name: 'Pilates',
          description:
            'A physical fitness system developed in the early 20th century by Joseph Pilates.',
        },
        {
          name: 'CrossFit',
          description:
            'A high-intensity fitness program incorporating elements from several sports and types of exercise.',
        },
        {
          name: 'Zumba',
          description:
            'A fitness program that combines Latin and international music with dance moves.',
        },
        {
          name: 'Boxing',
          description:
            'A combat sport in which two people engage in a contest of strength, speed, reflexes, endurance, and will.',
        },
        {
          name: 'Basketball',
          description:
            'A team sport in which two teams of five players compete to score points by shooting a ball through a hoop.',
        },
        {
          name: 'Football',
          description:
            'A team sport played between two teams of 11 players who primarily use their feet to propel a ball around a rectangular field.',
        },
        {
          name: 'Tennis',
          description:
            'A racket sport that can be played individually against a single opponent or between two teams of two players each.',
        },
        {
          name: 'Swimming',
          description:
            'A full-body workout that improves cardiovascular health and builds endurance in the water.',
        },
        {
          name: 'Volleyball',
          description:
            "A team sport in which two teams of six players are separated by a net and try to score points by grounding the ball on the other team's court.",
        },
        {
          name: 'Cycling',
          description:
            'A low-impact exercise that can help to tone muscles and improve cardiovascular fitness on a bicycle.',
        },
        {
          name: 'HIIT',
          description:
            'High-Intensity Interval Training that alternates short periods of intense anaerobic exercise with less intense recovery periods.',
        },
        {
          name: 'Kickboxing',
          description:
            'A group of stand-up combat sports based on kicking and punching, historically developed from karate mixed with boxing.',
        },
        {
          name: 'Rock Climbing',
          description:
            'A sport in which participants climb up, down, or across natural rock formations or artificial rock walls.',
        },
        {
          name: 'Barre',
          description:
            'A form of physical exercise, usually conducted in group classes in gyms or specialty studios, that combines elements of ballet, Pilates, and yoga.',
        },
        {
          name: 'TRX',
          description:
            'A form of suspension training that uses body weight exercises to develop strength, balance, flexibility, and core stability.',
        },
        {
          name: 'Martial Arts',
          description:
            'Various sports or skills that originated as forms of self-defense or attack, such as judo, karate, and kung fu.',
        },
        {
          name: 'Dance',
          description:
            'A performing art form consisting of purposefully selected sequences of human movement with aesthetic and symbolic value.',
        },
        {
          name: 'Gymnastics',
          description:
            'A sport that includes physical exercises requiring balance, strength, flexibility, agility, coordination, and endurance.',
        },
        {
          name: 'Rowing',
          description:
            'A sport that involves propelling a boat on water using oars, providing a full-body workout.',
        },
      ];

      await sportRepository.save(sports);
      console.log('Sports seeded successfully');
    } catch (error) {
      console.error('Error seeding sports:', error);
      throw error;
    }
  }
}
